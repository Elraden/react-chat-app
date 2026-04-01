import type { Message } from "../model/types";

type CreateChatRequestParams = {
    api: string;
    messages: Message[];
    parentId: string | null;
    branchId: string;
    signal: AbortSignal;
};

export const createChatRequest = async ({
    api,
    messages,
    parentId,
    branchId,
    signal,
}: CreateChatRequestParams): Promise<Response> => {
    return fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        },
        body: JSON.stringify({
            messages: messages.map((message) => ({
                id: message.id,
                role: message.role,
                content: message.content,
                createdAt: message.createdAt?.toISOString(),
                parentId: message.parentId ?? null,
                branchId: message.branchId,
                status: message.status,
                error: message.error ?? null,
                attachments: message.attachments?.map((attachment) => ({
                    id: attachment.id,
                    name: attachment.name,
                    type: attachment.type,
                    size: attachment.size,
                })),
            })),
            parentId,
            branchId,
        }),
        signal,
    });
};