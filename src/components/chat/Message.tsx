import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Message as ChatMessageModel } from "../../features/chat/model/types";

type MessageProps = {
    message: ChatMessageModel;
};

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
    };

    const isAssistant = message.role === "assistant";
    const authorLabel = isAssistant ? "GigaChat" : "Вы";
    const variantClass = isAssistant
        ? "message message--assistant"
        : "message message--user";

    const formattedTime = message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString()
        : "";

    const hasAttachments = !!message.attachments?.length;

    return (
        <div
            className={variantClass}
            aria-label={`Сообщение ${authorLabel}`}
        >
            <div className="message__body">
                <div className="message__avatar-block">
                    {isAssistant && (
                        <div className="message__avatar" aria-hidden="true">
                            G
                        </div>
                    )}

                    <div className="message__top">
                        <span className="message__author">{authorLabel}</span>

                        <button
                            type="button"
                            className="message__copy"
                            onClick={handleCopy}
                            aria-label="Скопировать сообщение"
                            disabled={!message.content}
                        >
                            {copied ? "Скопировано" : "Копировать"}
                        </button>
                    </div>
                </div>

                <div className="message__content markdown">
                    {message.content ? (
                        <ReactMarkdown
                            components={{
                                code({ inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const code = String(children).replace(/\n$/, "");

                                    if (!inline && match) {
                                        return (
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {code}
                                            </SyntaxHighlighter>
                                        );
                                    }

                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    ) : message.status === "streaming" ? (
                        <span className="message__streaming-placeholder">
                            Ответ генерируется...
                        </span>
                    ) : null}
                </div>

                {hasAttachments && (
                    <div className="message__attachments">
                        {message.attachments?.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="message__attachment"
                            >
                                {attachment.previewUrl ? (
                                    <img
                                        src={attachment.previewUrl}
                                        alt={attachment.name}
                                        className="message__attachment-preview"
                                    />
                                ) : (
                                    <div className="message__attachment-file">
                                        {attachment.name}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {message.error && (
                    <div className="message__error">
                        Ошибка: {message.error}
                    </div>
                )}

                {formattedTime && (
                    <div className="message__time">
                        {formattedTime}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
