import type { StoredAttachment, StoredMessage } from '../model/types';

export const isStoredAttachment = (value: unknown): value is StoredAttachment => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const item = value as Record<string, unknown>;

    return (
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.type === 'string' &&
        typeof item.size === 'number' &&
        (typeof item.previewUrl === 'string' || typeof item.previewUrl === 'undefined')
    );
};

export const isStoredMessage = (value: unknown): value is StoredMessage => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const item = value as Record<string, unknown>;

    const validRole =
        item.role === 'user' ||
        item.role === 'assistant' ||
        item.role === 'system';

    const validStatus =
        item.status === 'pending' ||
        item.status === 'streaming' ||
        item.status === 'done' ||
        item.status === 'error' ||
        typeof item.status === 'undefined';

    const validAttachments =
        typeof item.attachments === 'undefined' ||
        (Array.isArray(item.attachments) &&
            item.attachments.every(isStoredAttachment));

    return (
        typeof item.id === 'string' &&
        validRole &&
        typeof item.content === 'string' &&
        (typeof item.createdAt === 'string' || typeof item.createdAt === 'undefined') &&
        validAttachments &&
        (typeof item.parentId === 'string' ||
            item.parentId === null ||
            typeof item.parentId === 'undefined') &&
        (typeof item.branchId === 'string' || typeof item.branchId === 'undefined') &&
        validStatus &&
        (typeof item.error === 'string' ||
            item.error === null ||
            typeof item.error === 'undefined')
    );
};