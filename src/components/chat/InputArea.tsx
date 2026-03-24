import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Button from "../ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from "@fortawesome/free-solid-svg-icons";

function getLineHeight(el: HTMLTextAreaElement) {
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight);

    if (!Number.isNaN(lineHeight)) return lineHeight;

    const fontSize = parseFloat(computed.fontSize) || 16;
    return Math.round(fontSize * 1.2);
}

type InputAreaProps = {
    isLoading: boolean;
    onSend: (text: string) => void;
}

function InputArea({ isLoading, onSend }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const maxRows = 5;

    const resize = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "0px";

        const lineHeight = getLineHeight(el);
        const maxHeight = lineHeight * maxRows;
        const nextHeight = Math.min(el.scrollHeight, maxHeight);

        el.style.height = `${nextHeight}px`;
        el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    };

    useEffect(() => {
        resize();
    }, [value]);

    const sendMessage = () => {
        const trimmed = value.trim();
        if (!trimmed || isLoading) return;

        onSend(trimmed)
        setValue("");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage();
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const isSendDisabled = value.trim().length === 0 || isLoading;

    return (
        <form action="input-area" onSubmit={handleSubmit}>
            <div className="input-area__main">
                <div className="input-area__text">
                    <button type="button" className="icon-btn" aria-label="Прикрепить изображение">
                        <FontAwesomeIcon icon={faImages} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        className="input-area__textarea"
                        placeholder="Введите сообщение..."
                        rows={1}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                </div>
                <div className="input-area__actions">
                    <Button variant="secondary" type="button" disabled={isLoading}>
                        Стоп
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSendDisabled}
                    >
                        Отправить
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default InputArea;