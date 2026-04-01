import "dotenv/config";
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { Agent, fetch, setGlobalDispatcher } from "undici";

type ChatMessage = {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
};

type GigaChatTokenResponse = {
    access_token: string;
    expires_at: number;
};

const insecureDispatcher = new Agent({
    connect: {
        rejectUnauthorized: false,
    },
});

setGlobalDispatcher(insecureDispatcher);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 3001);
const GIGACHAT_AUTH_KEY = process.env.GIGACHAT_AUTH_KEY;
const GIGACHAT_SCOPE = process.env.GIGACHAT_SCOPE || "GIGACHAT_API_PERS";

if (!GIGACHAT_AUTH_KEY) {
    throw new Error("GIGACHAT_AUTH_KEY is not set");
}

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
    const now = Date.now();

    if (cachedToken && cachedTokenExpiresAt - 60_000 > now) {
        return cachedToken;
    }

    const body = new URLSearchParams({
        scope: GIGACHAT_SCOPE,
    }).toString();

    const response = await fetch("https://ngw.devices.sberbank.ru:9443/api/v2/oauth", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            RqUID: randomUUID(),
            Authorization: `Basic ${GIGACHAT_AUTH_KEY}`,
        },
        body,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth error ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as GigaChatTokenResponse;

    cachedToken = data.access_token;
    cachedTokenExpiresAt = data.expires_at;

    return data.access_token;
}

app.post("/api/chat", async (req, res) => {
    try {
        const messages: ChatMessage[] = Array.isArray(req.body.messages)
            ? req.body.messages
            : [];

        const accessToken = await getAccessToken();

        const gigaResponse = await fetch(
            "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    Authorization: `Bearer ${accessToken}`,
                    "X-Request-ID": randomUUID(),
                    "X-Session-ID": randomUUID(),
                },
                body: JSON.stringify({
                    model: "GigaChat",
                    messages: messages.map((message) => ({
                        role: message.role,
                        content: message.content,
                    })),
                    stream: true,
                    update_interval: 0,
                }),
            }
        );

        if (!gigaResponse.ok) {
            const errorText = await gigaResponse.text();
            console.error("GigaChat API error:", gigaResponse.status, errorText);

            return res.status(gigaResponse.status).json({
                error: `GigaChat API error: ${gigaResponse.status}`,
                details: errorText,
            });
        }

        if (!gigaResponse.body) {
            throw new Error("GigaChat response body is empty");
        }

        res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");

        const reader = gigaResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                buffer += decoder.decode();
            } else {
                buffer += decoder.decode(value, { stream: true });
            }

            const events = buffer.split("\n\n");
            buffer = events.pop() ?? "";

            for (const rawEvent of events) {
                const lines = rawEvent
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean);

                for (const line of lines) {
                    if (!line.startsWith("data:")) {
                        continue;
                    }

                    const payload = line.slice(5).trim();

                    if (!payload) {
                        continue;
                    }

                    if (payload === "[DONE]") {
                        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                        res.end();
                        return;
                    }

                    try {
                        const parsed = JSON.parse(payload) as {
                            choices?: Array<{
                                delta?: {
                                    content?: string;
                                };
                                finish_reason?: string | null;
                            }>;
                        };

                        const delta = parsed.choices?.[0]?.delta?.content ?? "";
                        const finishReason = parsed.choices?.[0]?.finish_reason ?? null;

                        if (delta) {
                            res.write(`data: ${JSON.stringify({ delta })}\n\n`);
                        }

                        if (finishReason === "stop") {
                            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                            res.end();
                            return;
                        }
                    } catch (parseError) {
                        console.error("SSE parse error:", parseError, payload);
                    }
                }
            }

            if (done) {
                break;
            }
        }

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch (error) {
        console.error("Server error:", error);

        const message =
            error instanceof Error ? error.message : "Server error";

        if (!res.headersSent) {
            res.status(500).json({ error: message });
            return;
        }

        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});