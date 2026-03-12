import type { ChatMessage } from "../../types"
import Message from "./Message"

type MessageListProps = {
    messages: ChatMessage[];
}

const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div className="message-list">
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    )
}

export default MessageList