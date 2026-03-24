export type Chat = {
    id: string;
    title: string;
    lastMessageDate: string;
    isActive?: boolean;
};

export type MessageRole = "user" | "assistant";

export type ChatMessage = {
    id: string;
    chatId: string;
    role: MessageRole;
    content: string;
    timestamp: string;
}

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