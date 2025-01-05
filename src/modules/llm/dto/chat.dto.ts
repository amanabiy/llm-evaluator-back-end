export class ChatMessageDto {
    role: string;
    content: string;
}

export class ChatResponseDto {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        message: { role: string; content: string };
        finish_reason: string;
        index: number;
    }>;
}
