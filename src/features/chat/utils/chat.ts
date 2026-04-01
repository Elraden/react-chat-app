export function generateChatTitle(text: string): string {
    const cleanText = text.trim().replace(/\s+/g, " ");

    if (!cleanText) {
        return "Новый чат";
    }

    return cleanText.length > 40
        ? cleanText.slice(0, 40) + "..."
        : cleanText;
}