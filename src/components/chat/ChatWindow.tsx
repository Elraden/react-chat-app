import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import EmptyState from "./EmptyState";
import InputArea from "./InputArea";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import { useChatContext } from "../../app/providers/ChatProvider";

type ChatWindowProps = {
    activeChatId: string;
    activeChatTitle?: string;
    onOpenSettings: () => void;
};

function ChatWindow({
    activeChatId,
    activeChatTitle,
    onOpenSettings,
}: ChatWindowProps) {
    const [files, setFiles] = useState<File[]>([]);

    const {
        state,
        setInput,
        sendMessage,
        stopStreaming,
        clearChatMessages,
    } = useChatContext();

    const messages = state.messagesByChatId[activeChatId] ?? [];
    const input = state.inputByChatId[activeChatId] ?? "";
    const isLoading = state.loadingByChatId[activeChatId] ?? false;
    const error = state.errorByChatId[activeChatId];

    const handleFilesChange = (nextFiles: File[]) => {
        setFiles(nextFiles);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleMainSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await sendMessage(activeChatId, files);
        setFiles([]);
    };

    return (
        <main className="chat-window">
            <div className="chat-window__header">
                <div className="chat-window__title">
                    {activeChatTitle || "Чат"}
                </div>

                <button
                    type="button"
                    className="icon-btn"
                    onClick={onOpenSettings}
                    aria-label="Открыть настройки"
                >
                    <FontAwesomeIcon icon={faGear} />
                </button>
            </div>

            <div className="chat-window__body">
                {error && (
                    <div className="chat-window__error">
                        Ошибка: {error}
                    </div>
                )}

                {messages.length === 0 ? (
                    <EmptyState />
                ) : (
                    <MessageList messages={messages} />
                )}

                {isLoading && <TypingIndicator isVisible />}
            </div>

            <div className="chat-window__footer">
                <InputArea
                    input={input}
                    isLoading={isLoading}
                    onInputChange={(e) =>
                        setInput(activeChatId, e.target.value)
                    }
                    onSubmit={handleMainSubmit}
                    onStop={() => stopStreaming(activeChatId)}
                    files={files}
                    onFilesChange={handleFilesChange}
                    onRemoveFile={handleRemoveFile}
                />

                <div className="chat-window__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => clearChatMessages(activeChatId)}
                        disabled={isLoading}
                    >
                        Очистить чат
                    </Button>
                </div>
            </div>
        </main>
    );
}

export default ChatWindow;