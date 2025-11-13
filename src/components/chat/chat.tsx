"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { fetchMessagesInfiniteAction } from "@/app/_actions/messages-infinite/messages-infinite";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageInput } from "@/components/chat/message-inpit";
import { MessageList } from "@/components/chat/message-list";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useSocket } from "@/hooks/useSocket";
import type { User } from "@/lib/api/user/types";
import type { Message } from "@/lib/types/chat";

interface ChatProps {
  currentUserId: number;
  recipient: User;
  initialMessages: Message[];
  conversationId?: number;
}

export const Chat = ({
  currentUserId,
  recipient,
  initialMessages,
  conversationId,
}: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [recipientOnlineStatus, setRecipientOnlineStatus] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["messages", conversationId],
      queryFn: ({ pageParam = 0 }) =>
        conversationId
          ? fetchMessagesInfiniteAction(conversationId, 10, pageParam)
          : Promise.resolve({
              conversationId: 0,
              messages: [],
              count: 0,
              hasMore: false,
              nextOffset: null,
            }),
      getNextPageParam: (lastPage) => lastPage.nextOffset,
      initialPageParam: 0,
      enabled: !!conversationId,
    });

  // ✅ Flatten all pages into single messages array
  const allMessages =
    data?.pages.flatMap((page) => page.messages) ?? initialMessages;

  const handleMessageReceived = useCallback((message: Message) => {
    setMessages((prev) => [message, ...prev]);
  }, []);

  const handleMessageStatusUpdate = useCallback(
    (data: {
      messageId: number;
      status: "PENDING" | "DELIVERED" | "READ";
      userId?: number;
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, status: data.status } : msg,
        ),
      );
    },
    [],
  );

  const handleUserStatusChange = useCallback(
    (data: { userId: number; status: "online" | "offline" }) => {
      if (data.userId === recipient.id) {
        setRecipientOnlineStatus(data.status === "online");
      }
    },
    [recipient.id],
  );

  const handleMessageSent = useCallback((message: Message) => {
    setMessages((prev) => [message, ...prev]);
  }, []);

  const {
    isConnected,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageAsRead,
    checkUserStatus,
  } = useSocket({
    userId: currentUserId,
    conversationId,
    onMessageReceived: handleMessageReceived,
    onMessageStatusUpdate: handleMessageStatusUpdate,
    onUserStatusChange: handleUserStatusChange,
    onMessageSent: handleMessageSent,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    if (!isConnected || messages.length === 0) return;

    // Get all unread messages from the recipient
    const unreadMessages = messages.filter(
      (msg) => msg.senderId === recipient.id && msg.status !== "READ",
    );

    // Mark each unread message as read
    if (unreadMessages.length > 0) {
      console.log(
        "🔵 Marking messages as read:",
        unreadMessages.map((m) => m.id),
      );
      unreadMessages.forEach((msg) => {
        markMessageAsRead(msg.id, msg.conversationId);
      });
    }
  }, [messages.length, isConnected]);

  useEffect(() => {
    if (isConnected && checkUserStatus) {
      checkUserStatus(recipient.id).then((status) => {
        setRecipientOnlineStatus(status.online);
      });
    }
  }, [isConnected, recipient.id, checkUserStatus]);

  const handleSendMessage = (content: string) => {
    sendMessage(content, recipient.id);
  };

  const isTyping = typingUsers.has(recipient.id);

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      <div className="px-4 pt-2">
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>
      <ChatHeader recipient={recipient} isOnline={recipientOnlineStatus} />
      <MessageList
        messages={allMessages}
        currentUserId={currentUserId}
        isTyping={isTyping}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />
      <MessageInput
        onSend={handleSendMessage}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
        disabled={!isConnected}
      />
    </Card>
  );
};
