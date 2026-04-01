import type { Message as ChatMessageModel } from "../../features/chat/model/types";
import Message from "./Message";

type MessageListProps = {
    messages: ChatMessageModel[];
};

const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div className="message-list">
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    );
};

export default MessageList;