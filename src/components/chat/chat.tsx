"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMessagesInfiniteAction } from "@/app/_actions/messages-infinite/messages-infinite";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageInput } from "@/components/chat/message-inpit";
import { MessageList } from "@/components/chat/message-list";
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
  const queryClient = useQueryClient();
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

  const allMessages = useMemo(() => {
    if (!data) return initialMessages;

    const messages = data.pages.flatMap((page) => page.messages);

    const messageMap = new Map<number, Message>();
    messages.forEach((message) => {
      if (!messageMap.has(message.id)) {
        messageMap.set(message.id, message);
      }
    });

    return Array.from(messageMap.values());
  }, [data, initialMessages]);

  const addMessageToCache = useCallback(
    (message: Message) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        const firstPage = old.pages[0];
        if (firstPage.messages.some((m: Message) => m.id === message.id)) {
          return old;
        }

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              messages: [message, ...firstPage.messages],
            },
            ...old.pages.slice(1),
          ],
        };
      });
    },
    [queryClient, conversationId],
  );

  const handleMessageReceived = useCallback(
    (message: Message) => {
      addMessageToCache(message);
    },
    [addMessageToCache],
  );

  const handleMessageStatusUpdate = useCallback(
    (data: {
      messageId: number;
      status: "PENDING" | "DELIVERED" | "READ";
      userId?: number;
    }) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === data.messageId ? { ...msg, status: data.status } : msg,
            ),
          })),
        };
      });
    },
    [queryClient, conversationId],
  );

  const handleUserStatusChange = useCallback(
    (data: { userId: number; status: "online" | "offline" }) => {
      if (data.userId === recipient.id) {
        setRecipientOnlineStatus(data.status === "online");
      }
    },
    [recipient.id],
  );

  const handleMessageSent = useCallback(
    (message: Message) => {
      addMessageToCache(message);
    },
    [addMessageToCache],
  );

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

  useEffect(() => {
    if (!isConnected || allMessages.length === 0) return;

    const unreadMessages = allMessages.filter(
      (msg) => msg.senderId === recipient.id && msg.status !== "READ",
    );

    if (unreadMessages.length > 0) {
      console.log(
        "🔵 Marking messages as read:",
        unreadMessages.map((m) => m.id),
      );
      unreadMessages.forEach((msg) => {
        markMessageAsRead(msg.id, msg.conversationId);
      });
    }
  }, [
    allMessages.length,
    isConnected,
    recipient.id,
    markMessageAsRead,
    allMessages,
  ]);

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
    <div className="w-full">
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
    </div>
  );
};
