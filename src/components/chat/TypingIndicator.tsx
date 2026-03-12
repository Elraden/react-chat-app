type TypingIndicatorProps = {
    isVisible?: boolean
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps) => {
    if (!isVisible) return null;

    return (
        <div className="typing-indicator" aria-label="Ассистент печатает">
            <div className="message__avatar" aria-hidden='true'>
                G
            </div>
            <div className="typing-indicator__bubble">
                <span />
                <span />
                <span />
            </div>
        </div>
    )
}

export default TypingIndicator