import { useMemo, useState } from "react";
import Button from "../ui/Button";
import SearchInput from "./SearchInput";
import ChatList from "./ChatList";
import type { Chat } from "../../features/chat/model/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "../../app/providers/ChatProvider";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
    chats: Chat[];
    activeChatId: string;
    onSelectChat: (chatId: string) => void;
    onCreateChat: () => void;
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({
    chats,
    activeChatId,
    onSelectChat,
    onCreateChat,
    isOpen,
    onClose,
}: SidebarProps) => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const { state, renameChat, deleteChat } = useChatContext();

    const filteredChats = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return chats;

        return chats.filter((chat) => {
            const titleMatch = chat.title.toLowerCase().includes(query);

            const messages = state.messagesByChatId[chat.id] ?? [];
            const lastMessage = messages[messages.length - 1];
            const lastMessageMatch = lastMessage?.content
                ?.toLowerCase()
                .includes(query);

            return titleMatch || !!lastMessageMatch;
        });
    }, [search, chats, state.messagesByChatId]);

    const handleRenameChat = (chatId: string, nextTitle: string) => {
        renameChat(chatId, nextTitle);
    };

    const handleDeleteChat = (chatId: string) => {
        const confirmed = window.confirm("Удалить чат?");
        if (!confirmed) return;

        const wasActive = chatId === activeChatId;

        deleteChat(chatId);

        if (wasActive) {
            navigate("/");
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
            <div className="sidebar__header">
                <Button variant="primary" onClick={onCreateChat}>
                    <FontAwesomeIcon icon={faPlus} /> Новый чат
                </Button>

                <button
                    type="button"
                    className="sidebar__close mobile-only"
                    onClick={onClose}
                    aria-label="Закрыть меню"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            <SearchInput value={search} onChange={setSearch} />

            <ChatList
                chats={filteredChats}
                activeChatId={activeChatId}
                onSelectChat={(chatId) => {
                    onSelectChat(chatId);
                    onClose();
                }}
                onRenameChat={handleRenameChat}
                onDeleteChat={handleDeleteChat}
            />
        </aside>
    );
};

export default Sidebar;