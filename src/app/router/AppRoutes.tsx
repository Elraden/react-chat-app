import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import type { Theme } from "../../features/chat/model/types";

type AppRoutesProps = {
    theme: Theme;
    onThemeChange: (theme: "light" | "dark") => void;
};

function AppRoutes({ theme, onThemeChange }: AppRoutesProps) {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <AppLayout
                        theme={theme}
                        onThemeChange={onThemeChange}
                    />
                }
            />
            <Route
                path="/chat/:id"
                element={
                    <AppLayout
                        theme={theme}
                        onThemeChange={onThemeChange}
                    />
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;