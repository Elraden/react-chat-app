import { useEffect, useRef, useState } from "react";
import type { Chat } from "../../features/chat/model/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

type ChatItemProps = {
    chat: Chat;
    isActive: boolean;
    onSelect: (chatId: string) => void;
    onRename: (chatId: string, nextTitle: string) => void;
    onDelete: (chatId: string) => void;
};

const ChatItem = ({
    chat,
    isActive,
    onSelect,
    onRename,
    onDelete,
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(chat.title);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setDraftTitle(chat.title);
    }, [chat.title]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        const normalized = draftTitle.trim();

        if (!normalized) {
            setDraftTitle(chat.title);
            setIsEditing(false);
            return;
        }

        onRename(chat.id, normalized);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDraftTitle(chat.title);
        setIsEditing(false);
    };

    const formattedDate = chat.lastMessageDate
        ? new Date(chat.lastMessageDate).toLocaleString()
        : "";

    return (
        <li
            className={`chat-item ${isActive ? "chat-item--active" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => {
                if (!isEditing) {
                    onSelect(chat.id);
                }
            }}
            onKeyDown={(e) => {
                if (isEditing) return;

                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(chat.id);
                }
            }}
        >
            <div className="chat-item__content">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        className="chat-item__input"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSave();
                            }

                            if (e.key === "Escape") {
                                e.preventDefault();
                                handleCancel();
                            }
                        }}
                    />
                ) : (
                    <div className="chat-item__title" title={chat.title}>
                        {chat.title}
                    </div>
                )}

                <div className="chat-item__date">{formattedDate}</div>
            </div>

            <div
                className="chat-item__actions"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="icon-btn"
                    aria-label="Редактировать"
                    onClick={() => setIsEditing(true)}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>

                <button
                    type="button"
                    className="icon-btn"
                    aria-label="Удалить"
                    onClick={() => onDelete(chat.id)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </li>
    );
};

export default ChatItem;