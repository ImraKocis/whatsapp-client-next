export interface User {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
}

export interface Message {
    id: number;
    content: string;
    senderId: number;
    conversationId: number;
    status: "PENDING" | "DELIVERED" | "READ";
    createdAt: string;
    sender?: User;
}

export interface Conversation {
    id: number;
    type: "DIRECT" | "GROUP";
    name?: string;
    participants: Array<{
        userId: number;
        User: User;
    }>;
    messages?: Message[];
}

export interface SendMessagePayload {
    conversationId?: number;
    recipientId?: number;
    content: string;
}

export interface TypingIndicator {
    userId: number;
    conversationId: number;
    isTyping: boolean;
}
