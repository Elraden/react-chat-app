import { useMemo, useState } from 'react';
import Button from '../ui/Button';
import SearchInput from './SearchInput';
import ChatList from './ChatList';
import type { Chat } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";

type SidebarProps = {
    chats: Chat[];
    activeChatId: string;
    onSelectChat: (chatId: string) => void;
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({ chats, activeChatId, onSelectChat, isOpen, onClose }: SidebarProps) => {
    const [search, setSearch] = useState("");


    const filteredChats = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return chats;

        return chats.filter((chat) =>
            chat.title.toLowerCase().includes(query));
    }, [search, chats])

    return (
        <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
            <div className='sidebar__header'>
                <Button variant='primary'><FontAwesomeIcon icon={faPlus} /> Новый чат</Button>
                <button
                    type='button'
                    className='sidebar__close mobile-only'
                    onClick={onClose}
                    aria-label='Закрыть меню'
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            <SearchInput value={search} onChange={setSearch} />
            <ChatList
                chats={filteredChats}
                activeChatId={activeChatId}
                onSelectChat={(chatId) => {
                    onSelectChat(chatId)
                    onClose();
                }}

            />
        </aside>
    )
}

export default Sidebar