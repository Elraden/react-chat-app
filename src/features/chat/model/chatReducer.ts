import type { ChatAction, ChatState, Message } from "./types";

export const initialChatState: ChatState = {
    chats: [],
    activeChatId: null,
    messagesByChatId: {},
    inputByChatId: {},
    loadingByChatId: {},
    errorByChatId: {},
};

function ensureChatMessages(
    messagesByChatId: ChatState["messagesByChatId"],
    chatId: string
): Message[] {
    return messagesByChatId[chatId] ?? [];
}

export function chatReducer(
    state: ChatState,
    action: ChatAction
): ChatState {
    switch (action.type) {
        case "LOAD_STATE":
            return action.payload;

        case "CREATE_CHAT": {
            const { chat } = action.payload;

            return {
                ...state,
                chats: [chat, ...state.chats],
                activeChatId: chat.id,
                messagesByChatId: {
                    ...state.messagesByChatId,
                    [chat.id]: state.messagesByChatId[chat.id] ?? [],
                },
                inputByChatId: {
                    ...state.inputByChatId,
                    [chat.id]: state.inputByChatId[chat.id] ?? "",
                },
                loadingByChatId: {
                    ...state.loadingByChatId,
                    [chat.id]: state.loadingByChatId[chat.id] ?? false,
                },
                errorByChatId: {
                    ...state.errorByChatId,
                    [chat.id]: state.errorByChatId[chat.id] ?? null,
                },
            };
        }

        case "DELETE_CHAT": {
            const { chatId } = action.payload;

            const nextMessages = { ...state.messagesByChatId };
            const nextInputs = { ...state.inputByChatId };
            const nextLoading = { ...state.loadingByChatId };
            const nextErrors = { ...state.errorByChatId };

            delete nextMessages[chatId];
            delete nextInputs[chatId];
            delete nextLoading[chatId];
            delete nextErrors[chatId];

            const nextChats = state.chats.filter((chat) => chat.id !== chatId);
            const nextActiveChatId =
                state.activeChatId === chatId
                    ? nextChats[0]?.id ?? null
                    : state.activeChatId;

            return {
                ...state,
                chats: nextChats,
                activeChatId: nextActiveChatId,
                messagesByChatId: nextMessages,
                inputByChatId: nextInputs,
                loadingByChatId: nextLoading,
                errorByChatId: nextErrors,
            };
        }

        case "RENAME_CHAT": {
            const { chatId, title } = action.payload;

            return {
                ...state,
                chats: state.chats.map((chat) =>
                    chat.id === chatId ? { ...chat, title } : chat
                ),
            };
        }

        case "SET_ACTIVE_CHAT": {
            return {
                ...state,
                activeChatId: action.payload.chatId,
            };
        }

        case "SET_INPUT": {
            const { chatId, value } = action.payload;

            return {
                ...state,
                inputByChatId: {
                    ...state.inputByChatId,
                    [chatId]: value,
                },
            };
        }

        case "CLEAR_CHAT_MESSAGES": {
            const { chatId } = action.payload;

            return {
                ...state,
                messagesByChatId: {
                    ...state.messagesByChatId,
                    [chatId]: [],
                },
                errorByChatId: {
                    ...state.errorByChatId,
                    [chatId]: null,
                },
            };
        }

        case "ADD_MESSAGES": {
            const { chatId, messages } = action.payload;
            const currentMessages = ensureChatMessages(
                state.messagesByChatId,
                chatId
            );

            return {
                ...state,
                messagesByChatId: {
                    ...state.messagesByChatId,
                    [chatId]: [...currentMessages, ...messages],
                },
            };
        }

        case "UPDATE_MESSAGE": {
            const { chatId, messageId, patch } = action.payload;
            const currentMessages = ensureChatMessages(
                state.messagesByChatId,
                chatId
            );

            return {
                ...state,
                messagesByChatId: {
                    ...state.messagesByChatId,
                    [chatId]: currentMessages.map((message) =>
                        message.id === messageId
                            ? { ...message, ...patch }
                            : message
                    ),
                },
            };
        }

        case "SET_LOADING": {
            const { chatId, value } = action.payload;

            return {
                ...state,
                loadingByChatId: {
                    ...state.loadingByChatId,
                    [chatId]: value,
                },
            };
        }

        case "SET_ERROR": {
            const { chatId, value } = action.payload;

            return {
                ...state,
                errorByChatId: {
                    ...state.errorByChatId,
                    [chatId]: value,
                },
            };
        }

        case "UPDATE_CHAT_LAST_MESSAGE_DATE": {
            const { chatId, lastMessageDate } = action.payload;

            return {
                ...state,
                chats: state.chats.map((chat) =>
                    chat.id === chatId
                        ? { ...chat, lastMessageDate }
                        : chat
                ),
            };
        }

        default:
            return state;
    }
}