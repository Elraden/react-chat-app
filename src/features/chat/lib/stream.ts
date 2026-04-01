import type { Message, StreamEvent } from '../model/types';

type HandleStreamParams = {
    response: Response;
    assistantMessage: Message;
    onChunk: (content: string) => void;
};

export const handleStream = async ({
    response,
    assistantMessage,
    onChunk,
}: HandleStreamParams): Promise<Message> => {
    if (!response.body) {
        throw new Error('Response body is empty');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullContent = '';
    let buffer = '';
    let isCompleted = false;

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            buffer += decoder.decode();
        } else {
            buffer += decoder.decode(value, { stream: true });
        }

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const rawEvent of events) {
            const lines = rawEvent
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);

            for (const line of lines) {
                if (!line.startsWith('data:')) {
                    continue;
                }

                const jsonText = line.slice(5).trim();

                if (!jsonText) {
                    continue;
                }

                let data: StreamEvent;

                try {
                    data = JSON.parse(jsonText) as StreamEvent;
                } catch {
                    continue;
                }

                if (data.error) {
                    throw new Error(data.error);
                }

                if (typeof data.delta === 'string') {
                    fullContent += data.delta;
                    onChunk(fullContent);
                }

                if (data.done) {
                    isCompleted = true;
                }
            }
        }

        if (done || isCompleted) {
            break;
        }
    }

    return {
        ...assistantMessage,
        content: fullContent,
        status: 'done',
        error: null,
    };
};