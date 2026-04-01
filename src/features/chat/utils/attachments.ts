import type { Attachment, Message } from '../model/types';
import { generateId } from './ids';

export const buildAttachments = (files: File[] = []): Attachment[] => {
    return files.map((file) => ({
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        file,
        previewUrl: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
    }));
};

export const revokeAttachmentUrls = (messages: Message[]) => {
    messages.forEach((message) => {
        message.attachments?.forEach((attachment) => {
            if (attachment.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(attachment.previewUrl);
            }
        });
    });
};