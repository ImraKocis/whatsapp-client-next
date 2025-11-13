"use server";

import { apiGet } from "@/lib/api/api-client";
import type { Message } from "@/lib/types/chat";

export interface MessagesResponse {
  conversationId: number;
  messages: Message[];
  count: number;
  hasMore: boolean;
  nextOffset: number | null;
}

export async function fetchMessagesInfiniteAction(
  conversationId: number,
  limit: number = 10,
  offset: number = 0,
): Promise<MessagesResponse> {
  const data = await apiGet<MessagesResponse>(
    `conversation/${conversationId}/messages?limit=${limit}&offset=${offset}`,
  );

  if (!data) {
    throw new Error("Failed to fetch messages");
  }

  return data;
}
