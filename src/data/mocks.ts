import type { Chat, ChatMessage, ScopeType, SettingsState } from '../types';

export const mockChats: Chat[] = [
    {
        id: 'chat-1',
        title: 'Разбор React-компонентов и props',
        lastMessageDate: '11.03.2026',
    },
    {
        id: 'chat-2',
        title: 'Подготовка к зачёту по PostgreSQL',
        lastMessageDate: '10.03.2026',
    },
    {
        id: 'chat-3',
        title: 'Идеи для pet-проекта на TypeScript',
        lastMessageDate: '09.03.2026',
    },
    {
        id: 'chat-4',
        title: 'План изучения Docker и контейнеров',
        lastMessageDate: '08.03.2026',
    },
    {
        id: 'chat-5',
        title: 'Конспект по useEffect и useState',
        lastMessageDate: '07.03.2026',
    },
];

export const mockMessages: ChatMessage[] = [
    {
        id: 'm-1',
        chatId: 'chat-1',
        role: 'user',
        content: 'Привет.\nПомоги составить план изучения **React**.',
        timestamp: '2026-03-11T10:00:00.000Z',
    },
    {
        id: 'm-2',
        chatId: 'chat-1',
        role: 'assistant',
        content:
            'Конечно.\n\nВот базовый план:\n\n- JSX\n- props\n- state\n- события\n- списки и ключи',
        timestamp: '2026-03-11T10:01:00.000Z',
    },
    {
        id: 'm-3',
        chatId: 'chat-1',
        role: 'user',
        content: 'Покажи пример простого компонента.',
        timestamp: '2026-03-11T10:02:00.000Z',
    },
    {
        id: 'm-4',
        chatId: 'chat-1',
        role: 'assistant',
        content: 'Вот пример:\n\n```tsx\nfunction Hello() {\n  return <h1>Hello</h1>;\n}\n```',
        timestamp: '2026-03-11T10:03:00.000Z',
    },
    {
        id: 'm-5',
        chatId: 'chat-1',
        role: 'user',
        content: 'А markdown тут должен поддерживаться?',
        timestamp: '2026-03-11T10:04:00.000Z',
    },
    {
        id: 'm-6',
        chatId: 'chat-1',
        role: 'assistant',
        content: 'Да. Например, можно использовать *курсив*, **жирный текст** и блоки кода.',
        timestamp: '2026-03-11T10:05:00.000Z',
    },
    {
        id: 'm-7',
        chatId: 'chat-2',
        role: 'user',
        content: 'Объясни, пожалуйста, что такое `JOIN` в PostgreSQL.',
        timestamp: '2026-03-10T10:00:00.000Z',
    },
    {
        id: 'm-8',
        chatId: 'chat-2',
        role: 'assistant',
        content: 'JOIN нужен, чтобы объединять строки из нескольких таблиц по связанному условию.',
        timestamp: '2026-03-10T10:01:00.000Z',
    },
    {
        id: 'm-9',
        chatId: 'chat-2',
        role: 'user',
        content: 'А чем `LEFT JOIN` отличается от `INNER JOIN`?',
        timestamp: '2026-03-10T10:02:00.000Z',
    },
    {
        id: 'm-10',
        chatId: 'chat-2',
        role: 'assistant',
        content:
            '- `INNER JOIN` возвращает только совпавшие строки\n- `LEFT JOIN` возвращает все строки из левой таблицы',
        timestamp: '2026-03-10T10:03:00.000Z',
    },
    {
        id: 'm-11',
        chatId: 'chat-3',
        role: 'user',
        content: 'Хочу придумать pet-project на TypeScript.',
        timestamp: '2026-03-09T10:00:00.000Z',
    },
    {
        id: 'm-12',
        chatId: 'chat-3',
        role: 'assistant',
        content: 'Можно сделать:\n\n- трекер задач\n- заметки с markdown\n- мини-чат\n- менеджер привычек',
        timestamp: '2026-03-09T10:01:00.000Z',
    },
    {
        id: 'm-13',
        chatId: 'chat-4',
        role: 'user',
        content: 'С чего начать изучение Docker?',
        timestamp: '2026-03-08T10:00:00.000Z',
    },
    {
        id: 'm-14',
        chatId: 'chat-4',
        role: 'assistant',
        content: 'Начни с образов, контейнеров, Dockerfile и docker-compose.',
        timestamp: '2026-03-08T10:01:00.000Z',
    },
    {
        id: 'm-15',
        chatId: 'chat-5',
        role: 'user',
        content: 'Объясни простыми словами `useEffect`.',
        timestamp: '2026-03-07T10:00:00.000Z',
    },
    {
        id: 'm-16',
        chatId: 'chat-5',
        role: 'assistant',
        content: '`useEffect` позволяет выполнить код после рендера компонента.',
        timestamp: '2026-03-07T10:01:00.000Z',
    },
];

export const defaultSettings: SettingsState = {
    model: 'GigaChat',
    temperature: 1,
    topP: 0.8,
    maxTokens: 1024,
    systemPrompt: 'Ты полезный ИИ-ассистент.',
    theme: 'light',
};

export const scopeOptions: ScopeType[] = [
    'GIGACHAT_API_PERS',
    'GIGACHAT_API_B2B',
    'GIGACHAT_API_CORP',
];