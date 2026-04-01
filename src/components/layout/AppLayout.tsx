import { useEffect, useMemo, useState } from "react";
import type { Theme } from "../../features/chat/model/types";
import ChatWindow from "../chat/ChatWindow";
import SettingsPanel from "../settings/SettingsPanel";
import Sidebar from "../sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "../../app/providers/ChatProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type AppLayoutProps = {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
};

function AppLayout({ theme, onThemeChange }: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const { id: routeChatId } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const { state, createChat, setActiveChat } = useChatContext();
    const { chats, activeChatId } = state;

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        if (location.pathname === "/") {
            if (activeChatId !== null) {
                setActiveChat(null);
            }
            return;
        }

        if (!routeChatId) {
            return;
        }

        const exists = chats.some((chat) => chat.id === routeChatId);

        if (!exists) {
            navigate("/", { replace: true });
            return;
        }

        if (activeChatId !== routeChatId) {
            setActiveChat(routeChatId);
        }
    }, [
        routeChatId,
        chats,
        activeChatId,
        setActiveChat,
        navigate,
        location.pathname,
    ]);

    const activeChat = useMemo(() => {
        return chats.find((chat) => chat.id === activeChatId) ?? null;
    }, [chats, activeChatId]);

    const handleCreateChat = () => {
        const newChatId = createChat();
        setIsSidebarOpen(false);
        navigate(`/chat/${newChatId}`);
    };

    const handleSelectChat = (chatId: string) => {
        setActiveChat(chatId);
        setIsSidebarOpen(false);
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="app-layout">
            <div className="mobile-header mobile-only">
                <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Открыть меню"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>

                <span className="mobile-header__title">
                    {activeChat ? activeChat.title : "GigaChat UI"}
                </span>
            </div>

            <Sidebar
                chats={chats}
                activeChatId={activeChatId ?? ""}
                onSelectChat={handleSelectChat}
                onCreateChat={handleCreateChat}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {activeChatId ? (
                <ChatWindow
                    key={activeChatId}
                    activeChatId={activeChatId}
                    activeChatTitle={activeChat?.title}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                />
            ) : (
                <main className="chat-window">
                    <div className="chat-window__body">
                        <div className="empty-state">
                            <h2>Чат не выбран</h2>
                            <p>Создайте новый чат или выберите существующий</p>
                        </div>
                    </div>
                </main>
            )}

            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onThemeChange={onThemeChange}
            />

            {isSidebarOpen && (
                <div
                    className="sidebar-backdrop mobile-only"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}

export default AppLayout;