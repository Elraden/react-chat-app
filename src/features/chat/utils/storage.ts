import type { Message, StoredAttachment, StoredMessage } from '../model/types';

export const fromStoredMessages = (messages: StoredMessage[]): Message[] => {
    return messages.map((message) => ({
        ...message,
        createdAt: message.createdAt ? new Date(message.createdAt) : undefined,
        attachments: message.attachments?.map((attachment) => ({
            id: attachment.id,
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            previewUrl: attachment.previewUrl,
        })),
    }));
};

export const serializeMessages = (messages: Message[]): string => {
    const storedMessages: StoredMessage[] = messages.map((message) => ({
        ...message,
        createdAt: message.createdAt?.toISOString(),
        attachments: message.attachments?.map(
            (attachment): StoredAttachment => ({
                id: attachment.id,
                name: attachment.name,
                type: attachment.type,
                size: attachment.size,
                previewUrl: attachment.previewUrl,
            })
        ),
    }));

    return JSON.stringify(storedMessages);
};