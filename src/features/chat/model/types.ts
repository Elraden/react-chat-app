export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'pending' | 'streaming' | 'done' | 'error';

export type Attachment = {
    id: string;
    name: string;
    type: string;
    size: number;
    file?: File;
    previewUrl?: string;
};

export type StoredAttachment = Omit<Attachment, 'file'>;

export type Message = {
    id: string;
    role: MessageRole;
    content: string;
    createdAt?: Date;
    attachments?: Attachment[];
    parentId?: string | null;
    branchId?: string;
    status?: MessageStatus;
    error?: string | null;
};

export type StoredMessage = Omit<Message, 'createdAt' | 'attachments'> & {
    createdAt?: string;
    attachments?: StoredAttachment[];
};

export type UseChatOptions = {
    api?: string;
    initialMessages?: Message[];
    storageKey?: string;
    onFinish?: (message: Message) => void;
    onError?: (error: Error) => void;
    onFirstUserMessage?: (content: string) => void;
};

export type SubmitOptions = {
    parentId?: string | null;
    branchId?: string;
    attachments?: File[];
};

export type StreamEvent = {
    delta?: string;
    done?: boolean;
    error?: string;
};

export type Chat = {
    id: string;
    title: string;
    lastMessageDate: string;
    isActive?: boolean;
};

export type ChatMessagesMap = Record<string, Message[]>;
export type ChatInputMap = Record<string, string>;
export type ChatLoadingMap = Record<string, boolean>;
export type ChatErrorMap = Record<string, string | null>;

export type ChatState = {
    chats: Chat[];
    activeChatId: string | null;
    messagesByChatId: ChatMessagesMap;
    inputByChatId: ChatInputMap;
    loadingByChatId: ChatLoadingMap;
    errorByChatId: ChatErrorMap;
};

export type PersistedChatState = {
    chats: Chat[];
    activeChatId: string | null;
    messagesByChatId: Record<string, StoredMessage[]>;
};

export type ChatAction =
    | {
        type: "LOAD_STATE";
        payload: ChatState;
    }
    | {
        type: "CREATE_CHAT";
        payload: { chat: Chat };
    }
    | {
        type: "DELETE_CHAT";
        payload: { chatId: string };
    }
    | {
        type: "RENAME_CHAT";
        payload: { chatId: string; title: string };
    }
    | {
        type: "SET_ACTIVE_CHAT";
        payload: { chatId: string | null };
    }
    | {
        type: "SET_INPUT";
        payload: { chatId: string; value: string };
    }
    | {
        type: "CLEAR_CHAT_MESSAGES";
        payload: { chatId: string };
    }
    | {
        type: "ADD_MESSAGES";
        payload: { chatId: string; messages: Message[] };
    }
    | {
        type: "UPDATE_MESSAGE";
        payload: {
            chatId: string;
            messageId: string;
            patch: Partial<Message>;
        };
    }
    | {
        type: "SET_LOADING";
        payload: { chatId: string; value: boolean };
    }
    | {
        type: "SET_ERROR";
        payload: { chatId: string; value: string | null };
    }
    | {
        type: "UPDATE_CHAT_LAST_MESSAGE_DATE";
        payload: { chatId: string; lastMessageDate: string };
    };


export type ScopeType = "GIGACHAT_API_PERS" | "GIGACHAT_API_B2B" | "GIGACHAT_API_CORP";

export type Theme = "light" | "dark";

export type ModelType =
    | "GigaChat"
    | "GigaChat-Plus"
    | "GigaChat-Pro"
    | "GigaChat-Max";

export type SettingsState = {
    model: ModelType;
    temperature: number;
    topP: number;
    maxTokens: number;
    systemPrompt: string;
    theme: Theme;
};