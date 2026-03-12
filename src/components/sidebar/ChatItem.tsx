import type { Chat } from "../../types"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

type ChatItemProps = {
    chat: Chat;
    isActive: boolean;
    onSelect: (chatId: string) => void;
}
const ChatItem = ({ chat, isActive, onSelect }: ChatItemProps) => {
    return (
        <li
            className={`chat-item ${isActive ? "chat-item--active" : ""}`}
            onClick={() => onSelect(chat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === " ") {
                    onSelect(chat.id)
                }
            }}
        >
            <div className="chat-item__content">
                <div className="chat-item__title" title={chat.title}>
                    {chat.title}
                </div>
                <div className="chat-item__date">{chat.lastMessageDate}</div>
            </div>

            <div className="chat-item__actions">
                <button type="button" className="icon-btn" aria-label="Редактировать">
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button type="button" className="icon-btn" aria-label="Удалить">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </li>
    )
}

export default ChatItem