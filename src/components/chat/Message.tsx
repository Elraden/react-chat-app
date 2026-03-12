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
            await navigator.clipboard.writeText(message.text);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1200);
        } catch {
            setCopied(false);
        }
    }

    return (
        <div
            className={`message message--${message.variant}`}
            aria-label={`Сообщение ${message.author}`}
        >
            {message.variant === 'assistant' && (
                <div className='message__avatar' aria-hidden='true'>
                    G
                </div>
            )}
            <div className='message__body'>
                <div className='message__top'>
                    <span className='message__author'>{message.author}</span>
                    <button
                        type='button'
                        className='message__copy'
                        onClick={handleCopy}
                        aria-label='Скопировать сообщение'
                    >
                        {copied ? "Скопировано" : "Копировать"}
                    </button>
                </div>

                <div className='message__content markdown'>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default Message