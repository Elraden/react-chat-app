import { mockMessages } from "../../data/mocks";
import Button from "../ui/Button";
import EmptyState from "./EmptyState";
import InputArea from "./InputArea";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import type { Chat, ChatMessage } from "../../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from "@fortawesome/free-solid-svg-icons";

type ChatWindowProps = {
    activeChat: Chat | undefined;
    messages: ChatMessage[];
    onOpenSettings: () => void;
};

const ChatWindow = ({ activeChat, messages, onOpenSettings }: ChatWindowProps) => {
    const hasMessages = mockMessages.length > 0;

    return (
        <section className="chat-window">
            <header className="chat-window__header">
                <div>
                    <h1 className="chat-window__title">
                        {activeChat ? activeChat.title : "Чат не выбран"}
                    </h1>
                    <p className="chat-window__subtitle">Моковый интерфейс чата</p>
                </div>

                <Button variant="ghost" onClick={onOpenSettings}>
                    <FontAwesomeIcon icon={faGear} />
                </Button>
            </header>

            <div className="chat-window__content">
                {!activeChat ? (
                    <EmptyState />
                ) : hasMessages ? (
                    <>
                        <MessageList messages={messages} />
                        <TypingIndicator isVisible />
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>

            <InputArea />
        </section>
    );
}

export default ChatWindow;