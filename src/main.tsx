import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/theme.css";
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import { ChatProvider } from './app/providers/ChatProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>,
)
