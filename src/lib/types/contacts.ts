export type ConversationType = "DIRECT" | "GROUP";

export interface ContactItem {
  id: number;
  type: ConversationType;
  name: string;
  avatar?: string | null;
  lastMessage?: {
    content: string;
    senderId: number;
    senderName?: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  userId?: number;
  participants?: number;
}
