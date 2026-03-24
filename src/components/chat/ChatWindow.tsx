import { mockMessages } from "../../data/mocks";
import Button from "../ui/Button";
import EmptyState from "./EmptyState";
import InputArea from "./InputArea";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import type { Chat, ChatMessage } from "../../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";

type ChatWindowProps = {
    activeChat: Chat | undefined;
    initialMessages: ChatMessage[];
    onOpenSettings: () => void;
};

const ChatWindow = ({ activeChat, initialMessages, onOpenSettings }: ChatWindowProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
    const [isLoading, setIsLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        setMessages(initialMessages);
        setIsLoading(false);

        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, [initialMessages, activeChat?.id])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current)
            }
        }
    }, []);


    const handleSendMessage = (text: string) => {
        if (!activeChat) {
            return;
        }

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            chatId: activeChat.id,
            role: "user",
            content: text,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        const delay = 1000 + Math.floor(Math.random() * 1000);

        timeoutRef.current = window.setTimeout(() => {
            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                chatId: activeChat.id,
                role: "assistant",
                content: `Ответ ассистента на сообщение: "${text}"`,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
            timeoutRef.current = null;

        }, delay);
    };

    const hasMessages = messages.length > 0;

    return (
        <section className="chat-window">
            <header className="chat-window__header">

                <div>
                    <h1 className="chat-window__title">
                        {activeChat ? activeChat.title : "Чат не выбран"}
                    </h1>
                    {/* <p className="chat-window__subtitle">Моковый интерфейс чата</p> */}
                </div>

                <Button variant="ghost" onClick={onOpenSettings}>
                    <FontAwesomeIcon icon={faGear} />
                </Button>
            </header>

            <div className="chat-window__content">
                {!activeChat ? (
                    <EmptyState />
                ) : (
                    <>
                        {hasMessages ? <MessageList messages={messages} /> : <EmptyState />}
                        <TypingIndicator isVisible={isLoading} />
                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            <InputArea isLoading={isLoading} onSend={handleSendMessage} />
        </section>
    );
}

export default ChatWindow;