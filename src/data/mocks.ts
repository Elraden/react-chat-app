import type { Chat, ChatMessage, ScopeType, SettingsState } from "../types";

export const mockChats: Chat[] = [
    {
        id: "chat-1",
        title: "Разбор React-компонентов и props",
        lastMessageDate: "11.03.2026",
    },
    {
        id: "chat-2",
        title: "Подготовка к зачёту по PostgreSQL",
        lastMessageDate: "10.03.2026",
    },
    {
        id: "chat-3",
        title: "Идеи для pet-проекта на TypeScript",
        lastMessageDate: "09.03.2026",
    },
    {
        id: "chat-4",
        title: "План изучения Docker и контейнеров",
        lastMessageDate: "08.03.2026",
    },
    {
        id: "chat-5",
        title: "Конспект по useEffect и useState",
        lastMessageDate: "07.03.2026",
    },
];

export const mockMessages: ChatMessage[] = [
    {
        id: "m-1",
        chatId: "chat-1",
        author: "Пользователь",
        variant: "user",
        text: "Привет. Помоги составить план изучения **React**.",
    },
    {
        id: "m-2",
        chatId: "chat-1",
        author: "GigaChat",
        variant: "assistant",
        text: "Конечно.\n\nВот базовый план:\n\n- JSX\n- props\n- state\n- события\n- списки и ключи",
    },
    {
        id: "m-3",
        chatId: "chat-1",
        author: "Пользователь",
        variant: "user",
        text: "Покажи пример простого компонента.",
    },
    {
        id: "m-4",
        chatId: "chat-1",
        author: "GigaChat",
        variant: "assistant",
        text: "Вот пример:\n\n```tsx\nfunction Hello() {\n  return <h1>Hello</h1>;\n}\n```",
    },
    {
        id: "m-5",
        chatId: "chat-1",
        author: "Пользователь",
        variant: "user",
        text: "А markdown тут должен поддерживаться?",
    },
    {
        id: "m-6",
        chatId: "chat-1",
        author: "GigaChat",
        variant: "assistant",
        text: "Да. Например, можно использовать *курсив*, **жирный текст** и блоки кода.",
    },

    {
        id: "m-7",
        chatId: "chat-2",
        author: "Пользователь",
        variant: "user",
        text: "Объясни, пожалуйста, что такое `JOIN` в PostgreSQL.",
    },
    {
        id: "m-8",
        chatId: "chat-2",
        author: "GigaChat",
        variant: "assistant",
        text: "JOIN нужен, чтобы объединять строки из нескольких таблиц по связанному условию.",
    },
    {
        id: "m-9",
        chatId: "chat-2",
        author: "Пользователь",
        variant: "user",
        text: "А чем `LEFT JOIN` отличается от `INNER JOIN`?",
    },
    {
        id: "m-10",
        chatId: "chat-2",
        author: "GigaChat",
        variant: "assistant",
        text: "- `INNER JOIN` возвращает только совпавшие строки\n- `LEFT JOIN` возвращает все строки из левой таблицы",
    },

    {
        id: "m-11",
        chatId: "chat-3",
        author: "Пользователь",
        variant: "user",
        text: "Хочу придумать pet-project на TypeScript.",
    },
    {
        id: "m-12",
        chatId: "chat-3",
        author: "GigaChat",
        variant: "assistant",
        text: "Можно сделать:\n\n- трекер задач\n- заметки с markdown\n- мини-чат\n- менеджер привычек",
    },

    {
        id: "m-13",
        chatId: "chat-4",
        author: "Пользователь",
        variant: "user",
        text: "С чего начать изучение Docker?",
    },
    {
        id: "m-14",
        chatId: "chat-4",
        author: "GigaChat",
        variant: "assistant",
        text: "Начни с образов, контейнеров, Dockerfile и docker-compose.",
    },

    {
        id: "m-15",
        chatId: "chat-5",
        author: "Пользователь",
        variant: "user",
        text: "Объясни простыми словами `useEffect`.",
    },
    {
        id: "m-16",
        chatId: "chat-5",
        author: "GigaChat",
        variant: "assistant",
        text: "`useEffect` позволяет выполнить код после рендера компонента.",
    },
];

export const defaultSettings: SettingsState = {
    model: "GigaChat",
    temperature: 1,
    topP: 0.8,
    maxTokens: 1024,
    systemPrompt: "Ты полезный ИИ-ассистент.",
    theme: "light",
};

export const scopeOptions: ScopeType[] = [
    "GIGACHAT_API_PERS",
    "GIGACHAT_API_B2B",
    "GIGACHAT_API_CORP",
];