import { useState } from "react";
import AuthForm from "./components/auth/AuthForm";
import AppLayout from "./components/layout/AppLayout";
import type { Theme } from "./types";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");

  return isAuthorized ? (
    <AppLayout theme={theme} onThemeChange={setTheme} />
  ) : (
    <AuthForm onLogin={() => setIsAuthorized(true)} />
  );
}

export default App;