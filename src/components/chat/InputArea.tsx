import {
    useEffect,
    useRef,
    type ChangeEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

function getLineHeight(el: HTMLTextAreaElement) {
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight);

    if (!Number.isNaN(lineHeight)) return lineHeight;

    const fontSize = parseFloat(computed.fontSize) || 16;
    return Math.round(fontSize * 1.2);
}

type InputAreaProps = {
    input: string;
    isLoading: boolean;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    onStop: () => void;
    files: File[];
    onFilesChange: (files: File[]) => void;
    onRemoveFile: (index: number) => void;
};

function InputArea({
    input,
    isLoading,
    onInputChange,
    onSubmit,
    onStop,
    files,
    onFilesChange,
    onRemoveFile,
}: InputAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    }, [input]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (input.trim().length === 0 && files.length === 0) {
                return;
            }

            const form = e.currentTarget.form;
            if (form) {
                form.requestSubmit();
            }
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? []);
        onFilesChange(selectedFiles);
    };

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };

    const isSendDisabled =
        (input.trim().length === 0 && files.length === 0) || isLoading;

    return (
        <form className="input-area" onSubmit={onSubmit}>
            <div className="input-area__main">
                <div className="input-area__text">
                    <button
                        type="button"
                        className="icon-btn"
                        aria-label="Прикрепить изображение"
                        onClick={handleOpenFileDialog}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faImages} />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileChange}
                    />

                    <textarea
                        ref={textareaRef}
                        className="input-area__textarea"
                        placeholder="Введите сообщение..."
                        rows={1}
                        value={input}
                        onChange={onInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                </div>

                {files.length > 0 && (
                    <div className="input-area__files">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="input-area__file"
                            >
                                <span>
                                    {file.name} ({file.size} байт)
                                </span>

                                <button
                                    type="button"
                                    className="input-area__remove-file"
                                    onClick={() => onRemoveFile(index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="input-area__actions">
                    <Button
                        variant="secondary"
                        type="button"
                        disabled={!isLoading}
                        onClick={onStop}
                    >
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