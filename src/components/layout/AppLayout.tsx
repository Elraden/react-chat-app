import { useEffect, useMemo, useState } from "react";
import { mockChats, mockMessages } from "../../data/mocks";
import type { Theme } from "../../types";
import ChatWindow from "../chat/ChatWindow";
import SettingsPanel from "../settings/SettingsPanel";
import Sidebar from "../sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons";

type AppLayoutProps = {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
};

function AppLayout({ theme, onThemeChange }: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeChatId, setActiveChatId] = useState<string>(mockChats[0]?.id ?? "");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const activeChat = useMemo(() => {
        return mockChats.find((chat) => chat.id === activeChatId);
    }, [activeChatId]);

    const initialMessages = useMemo(() => {
        return mockMessages.filter((message) => message.chatId === activeChatId);
    }, [activeChatId]);

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
                chats={mockChats}
                activeChatId={activeChatId}
                onSelectChat={setActiveChatId}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <ChatWindow
                activeChat={activeChat}
                initialMessages={initialMessages}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />

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