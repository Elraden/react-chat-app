import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    type ReactNode,
} from "react";
import { chatReducer, initialChatState } from "../../features/chat/model/chatReducer";
import type {
    Chat,
    ChatState,
    Message,
    PersistedChatState,
    StoredMessage,
    ChatAction,
} from "../../features/chat/model/types";
import { generateId } from "../../features/chat/utils/ids";
import { generateChatTitle } from "../../features/chat/utils/chat";
import {
    buildAttachments,
    revokeAttachmentUrls,
} from "../../features/chat/utils/attachments";
import { createChatRequest } from "../../features/chat/lib/request";
import { handleStream } from "../../features/chat/lib/stream";
import {
    fromStoredMessages,
} from "../../features/chat/utils/storage";
import { isStoredMessage } from "../../features/chat/utils/guards";

const CHAT_STATE_KEY = "gigachat_app_state";

type ChatContextValue = {
    state: ChatState;
    createChat: () => string;
    renameChat: (chatId: string, title: string) => void;
    deleteChat: (chatId: string) => void;
    setActiveChat: (chatId: string | null) => void;
    setInput: (chatId: string, value: string) => void;
    clearChatMessages: (chatId: string) => void;
    sendMessage: (chatId: string, files?: File[]) => Promise<void>;
    stopStreaming: (chatId?: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function createEmptyChat(index?: number): Chat {
    const now = new Date().toISOString();

    return {
        id: `chat-${generateId()}`,
        title: index ? `Диалог ${index}` : "Новый чат",
        lastMessageDate: now,
    };
}

function buildInitialStateWithChat(chat: Chat): ChatState {
    return {
        ...initialChatState,
        chats: [chat],
        activeChatId: chat.id,
        messagesByChatId: {
            [chat.id]: [],
        },
        inputByChatId: {
            [chat.id]: "",
        },
        loadingByChatId: {
            [chat.id]: false,
        },
        errorByChatId: {
            [chat.id]: null,
        },
    };
}

function toStoredMessages(messages: Message[]): StoredMessage[] {
    return messages.map((message) => ({
        ...message,
        createdAt: message.createdAt?.toISOString(),
        attachments: message.attachments?.map((attachment) => ({
            id: attachment.id,
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            previewUrl: attachment.previewUrl,
        })),
    }));
}

function parsePersistedState(): ChatState {
    const raw = localStorage.getItem(CHAT_STATE_KEY);

    if (!raw) {
        return buildInitialStateWithChat(createEmptyChat());
    }

    try {
        const parsed = JSON.parse(raw) as PersistedChatState;

        if (
            !parsed ||
            typeof parsed !== "object" ||
            !Array.isArray(parsed.chats) ||
            typeof parsed.messagesByChatId !== "object" ||
            parsed.messagesByChatId === null
        ) {
            throw new Error("Invalid persisted state");
        }

        const chats = parsed.chats.filter((chat): chat is Chat => {
            return (
                typeof chat === "object" &&
                chat !== null &&
                typeof chat.id === "string" &&
                typeof chat.title === "string" &&
                typeof chat.lastMessageDate === "string"
            );
        });

        if (chats.length === 0) {
            return buildInitialStateWithChat(createEmptyChat());
        }

        const messagesByChatId: Record<string, Message[]> = {};

        for (const [chatId, storedMessages] of Object.entries(
            parsed.messagesByChatId
        )) {
            if (
                Array.isArray(storedMessages) &&
                storedMessages.every(isStoredMessage)
            ) {
                messagesByChatId[chatId] = fromStoredMessages(storedMessages);
            } else {
                messagesByChatId[chatId] = [];
            }
        }

        const activeChatId =
            parsed.activeChatId &&
                chats.some((chat) => chat.id === parsed.activeChatId)
                ? parsed.activeChatId
                : chats[0].id;

        const inputByChatId: Record<string, string> = {};
        const loadingByChatId: Record<string, boolean> = {};
        const errorByChatId: Record<string, string | null> = {};

        for (const chat of chats) {
            if (!messagesByChatId[chat.id]) {
                messagesByChatId[chat.id] = [];
            }

            inputByChatId[chat.id] = "";
            loadingByChatId[chat.id] = false;
            errorByChatId[chat.id] = null;
        }

        return {
            chats,
            activeChatId,
            messagesByChatId,
            inputByChatId,
            loadingByChatId,
            errorByChatId,
        };
    } catch {
        return buildInitialStateWithChat(createEmptyChat());
    }
}

export function ChatProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(
        chatReducer,
        initialChatState,
        parsePersistedState
    );

    const controllersRef = useRef<Map<string, AbortController>>(new Map());
    const messagesRef = useRef(state.messagesByChatId);

    useEffect(() => {
        messagesRef.current = state.messagesByChatId;
    }, [state.messagesByChatId]);

    useEffect(() => {
        const persisted: PersistedChatState = {
            chats: state.chats,
            activeChatId: state.activeChatId,
            messagesByChatId: Object.fromEntries(
                Object.entries(state.messagesByChatId).map(([chatId, messages]) => [
                    chatId,
                    toStoredMessages(messages),
                ])
            ),
        };

        localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(persisted));
    }, [state]);

    useEffect(() => {
        return () => {
            controllersRef.current.forEach((controller) => controller.abort());
            controllersRef.current.clear();

            Object.values(messagesRef.current).forEach((messages) => {
                revokeAttachmentUrls(messages);
            });
        };
    }, []);

    const createChat = useCallback(() => {
        const defaultTitle =
            state.chats.length === 0
                ? "Новый чат"
                : `Диалог ${state.chats.length + 1}`;

        const chat: Chat = {
            id: `chat-${generateId()}`,
            title: defaultTitle,
            lastMessageDate: new Date().toISOString(),
        };

        dispatch({
            type: "CREATE_CHAT",
            payload: { chat },
        });

        return chat.id;
    }, [state.chats.length]);

    const renameChat = useCallback((chatId: string, title: string) => {
        const normalizedTitle = title.trim();

        if (!normalizedTitle) {
            return;
        }

        dispatch({
            type: "RENAME_CHAT",
            payload: { chatId, title: normalizedTitle },
        });
    }, []);

    const deleteChat = useCallback(
        (chatId: string) => {
            const messages = state.messagesByChatId[chatId] ?? [];
            revokeAttachmentUrls(messages);

            const nextControllers = new Map(controllersRef.current);

            nextControllers.forEach((controller, key) => {
                if (key.startsWith(`${chatId}:`)) {
                    controller.abort();
                    nextControllers.delete(key);
                }
            });

            controllersRef.current = nextControllers;

            dispatch({
                type: "DELETE_CHAT",
                payload: { chatId },
            });
        },
        [state.messagesByChatId]
    );

    const setActiveChat = useCallback((chatId: string | null) => {
        dispatch({
            type: "SET_ACTIVE_CHAT",
            payload: { chatId },
        });
    }, []);

    const setInput = useCallback((chatId: string, value: string) => {
        dispatch({
            type: "SET_INPUT",
            payload: { chatId, value },
        });
    }, []);

    const clearChatMessages = useCallback(
        (chatId: string) => {
            const messages = state.messagesByChatId[chatId] ?? [];
            revokeAttachmentUrls(messages);

            dispatch({
                type: "CLEAR_CHAT_MESSAGES",
                payload: { chatId },
            });

            dispatch({
                type: "SET_ERROR",
                payload: { chatId, value: null },
            });

            dispatch({
                type: "SET_INPUT",
                payload: { chatId, value: "" },
            });

            dispatch({
                type: "SET_LOADING",
                payload: { chatId, value: false },
            });
        },
        [state.messagesByChatId]
    );

    const stopStreaming = useCallback(
        (chatId?: string) => {
            if (!chatId) {
                const affectedChatIds = new Set<string>();

                controllersRef.current.forEach((controller, key) => {
                    controller.abort();

                    const [targetChatId] = key.split(":");
                    if (targetChatId) {
                        affectedChatIds.add(targetChatId);
                    }
                });

                controllersRef.current.clear();

                affectedChatIds.forEach((targetChatId) => {
                    dispatch({
                        type: "SET_LOADING",
                        payload: { chatId: targetChatId, value: false },
                    });
                });

                return;
            }

            controllersRef.current.forEach((controller, key) => {
                if (key.startsWith(`${chatId}:`)) {
                    controller.abort();
                    controllersRef.current.delete(key);
                }
            });

            dispatch({
                type: "SET_LOADING",
                payload: { chatId, value: false },
            });
        },
        []
    );

    const sendMessage = useCallback(
        async (chatId: string, files: File[] = []) => {
            const input = state.inputByChatId[chatId] ?? "";
            const trimmedContent = input.trim();

            if (!trimmedContent && files.length === 0) {
                return;
            }

            dispatch({
                type: "SET_ERROR",
                payload: { chatId, value: null },
            });

            const requestId = `${chatId}:${generateId()}`;
            const controller = new AbortController();
            controllersRef.current.set(requestId, controller);

            const currentMessages = state.messagesByChatId[chatId] ?? [];
            const attachments = buildAttachments(files);
            const branchId = generateId();

            const userMessage: Message = {
                id: generateId(),
                role: "user",
                content: trimmedContent,
                createdAt: new Date(),
                attachments,
                parentId: null,
                branchId,
                status: "done",
                error: null,
            };

            const assistantMessage: Message = {
                id: generateId(),
                role: "assistant",
                content: "",
                createdAt: new Date(),
                parentId: userMessage.id,
                branchId,
                status: "streaming",
                error: null,
            };

            const requestMessages = [...currentMessages, userMessage];
            const isFirstUserMessage = !currentMessages.some(
                (message) => message.role === "user"
            );

            dispatch({
                type: "ADD_MESSAGES",
                payload: {
                    chatId,
                    messages: [userMessage, assistantMessage],
                },
            });

            dispatch({
                type: "SET_INPUT",
                payload: { chatId, value: "" },
            });

            dispatch({
                type: "SET_LOADING",
                payload: { chatId, value: true },
            });

            dispatch({
                type: "UPDATE_CHAT_LAST_MESSAGE_DATE",
                payload: {
                    chatId,
                    lastMessageDate: new Date().toISOString(),
                },
            });

            if (isFirstUserMessage && trimmedContent) {
                const generatedTitle = generateChatTitle(trimmedContent);

                dispatch({
                    type: "RENAME_CHAT",
                    payload: {
                        chatId,
                        title: generatedTitle || "Новый чат",
                    },
                });
            }

            try {
                const response = await createChatRequest({
                    api: "/api/chat",
                    messages: requestMessages,
                    parentId: null,
                    branchId,
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const finalMessage = await handleStream({
                    response,
                    assistantMessage,
                    onChunk: (nextContent) => {
                        dispatch({
                            type: "UPDATE_MESSAGE",
                            payload: {
                                chatId,
                                messageId: assistantMessage.id,
                                patch: {
                                    content: nextContent,
                                    status: "streaming",
                                },
                            },
                        });
                    },
                });

                dispatch({
                    type: "UPDATE_MESSAGE",
                    payload: {
                        chatId,
                        messageId: assistantMessage.id,
                        patch: finalMessage,
                    },
                });

                dispatch({
                    type: "UPDATE_CHAT_LAST_MESSAGE_DATE",
                    payload: {
                        chatId,
                        lastMessageDate: new Date().toISOString(),
                    },
                });
            } catch (err: unknown) {
                const normalizedError =
                    err instanceof Error ? err : new Error("Unknown error");

                if (normalizedError.name === "AbortError") {
                    dispatch({
                        type: "UPDATE_MESSAGE",
                        payload: {
                            chatId,
                            messageId: assistantMessage.id,
                            patch: {
                                status: "done",
                            },
                        },
                    });

                    return;
                }

                const currentAssistantMessage =
                    (messagesRef.current[chatId] ?? []).find(
                        (message) => message.id === assistantMessage.id
                    ) ?? assistantMessage;

                dispatch({
                    type: "SET_ERROR",
                    payload: { chatId, value: normalizedError.message },
                });

                dispatch({
                    type: "UPDATE_MESSAGE",
                    payload: {
                        chatId,
                        messageId: assistantMessage.id,
                        patch: {
                            status: "error",
                            error: normalizedError.message,
                            content:
                                currentAssistantMessage.content ||
                                "Ошибка при получении ответа",
                        },
                    },
                });
            } finally {
                controllersRef.current.delete(requestId);

                dispatch({
                    type: "SET_LOADING",
                    payload: { chatId, value: false },
                });
            }
        },
        [state.inputByChatId, state.messagesByChatId]
    );

    const value = useMemo<ChatContextValue>(
        () => ({
            state,
            createChat,
            renameChat,
            deleteChat,
            setActiveChat,
            setInput,
            clearChatMessages,
            sendMessage,
            stopStreaming,
        }),
        [
            state,
            createChat,
            renameChat,
            deleteChat,
            setActiveChat,
            setInput,
            clearChatMessages,
            sendMessage,
            stopStreaming,
        ]
    );

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error("useChatContext must be used within ChatProvider");
    }

    return context;
}