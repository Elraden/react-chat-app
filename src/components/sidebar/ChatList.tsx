import type { Chat } from "../../features/chat/model/types";
import ChatItem from "./ChatItem";

type ChatListProps = {
    chats: Chat[];
    activeChatId: string;
    onSelectChat: (chatId: string) => void;
    onRenameChat: (chatId: string, nextTitle: string) => void;
    onDeleteChat: (chatId: string) => void;
};

const ChatList = ({
    chats,
    activeChatId,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
}: ChatListProps) => {
    return (
        <ul className="chat-list">
            {chats.map((chat) => (
                <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelect={onSelectChat}
                    onRename={onRenameChat}
                    onDelete={onDeleteChat}
                />
            ))}
        </ul>
    );
};

export default ChatList;