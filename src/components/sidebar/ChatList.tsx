import type { Chat } from "../../types";
import ChatItem from "./ChatItem";

type ChatListProps = {
    chats: Chat[];
    activeChatId: string;
    onSelectChat: (chatId: string) => void;
}

const ChatList = ({ chats, activeChatId, onSelectChat }: ChatListProps) => {
    return (
        <ul className="chat-list">
            {chats.map((chat) => (
                <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelect={onSelectChat}
                />
            ))}
        </ul>
    )
}

export default ChatList