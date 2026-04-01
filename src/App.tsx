import { useState } from "react";
import AuthForm from "./components/auth/AuthForm";
import type { Theme } from "./features/chat/model/types";
import AppRoutes from "./app/router/AppRoutes";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");

  if (!isAuthorized) {
    return <AuthForm onLogin={() => setIsAuthorized(true)} />;
  }

  return (
    <AppRoutes
      theme={theme}
      onThemeChange={setTheme}
    />
  );
}

export default App;