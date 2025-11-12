import type { User } from "@/lib/api/user/types";

export interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: number;
  status: "PENDING" | "DELIVERED" | "READ";
  createdAt: string;
  Sender?: Pick<User, "id" | "firstName" | "lastName" | "avatar">;
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
