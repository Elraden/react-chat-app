import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../types';

type MessageProps = {
    message: ChatMessage;
}
const Message = ({ message }: MessageProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1200);
        } catch {
            setCopied(false);
        }
    }

    const isAssistant = message.role === "assistant";
    const authorLabel = message.role === "assistant" ? "GigaChat" : "Вы";
    const variantClass = message.role ===
        "assistant"
        ? "message message--assistant"
        : "message message--user"

    return (
        <div
            className={variantClass}
            aria-label={`Сообщение ${authorLabel}`}
        >
            <div className='message__body'>
                <div className='message__avatar-block'>
                    {isAssistant && (
                        <div className='message__avatar' aria-hidden='true'>
                            G
                        </div>
                    )}

                    <div className='message__top'>
                        <span className='message__author'>{authorLabel}</span>
                        <button
                            type='button'
                            className='message__copy'
                            onClick={handleCopy}
                            aria-label='Скопировать сообщение'
                        >
                            {copied ? "Скопировано" : "Копировать"}
                        </button>
                    </div>
                </div>

                <div className='message__content markdown'>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <div className='message__time'>
                    {new Date(message.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </div>
    )
}

export default Message