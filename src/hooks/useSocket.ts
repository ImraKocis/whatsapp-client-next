"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { useUser } from "@/lib/redux/hooks";
import { disconnectSocket, getSocket } from "@/lib/socket";
import type { Message, TypingIndicator } from "@/lib/types/chat";

interface UseSocketProps {
  userId: number;
  conversationId?: number;
  onMessageReceived?: (message: Message) => void;
  onMessageStatusUpdate?: (data: {
    messageId: number;
    status: "PENDING" | "DELIVERED" | "READ";
    userId?: number;
  }) => void;
  onUserStatusChange?: (data: {
    userId: number;
    status: "online" | "offline";
  }) => void;
  onMessageSent?: (message: Message) => void;
}

export const useSocket = ({
  userId,
  conversationId,
  onMessageReceived,
  onMessageStatusUpdate,
  onUserStatusChange,
  onMessageSent,
}: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const hasConnected = useRef(false);
  const user = useUser();

  useEffect(() => {
    if (hasConnected.current) return;
    hasConnected.current = true;

    const socketInstance = getSocket(userId);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Connected to chat server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from chat server");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    socketInstance.on("message:received", (message: Message) => {
      if (onMessageReceived) {
        onMessageReceived(message);
      }
    });

    socketInstance.on(
      "message:status",
      (data: {
        messageId: number;
        status: "PENDING" | "DELIVERED" | "READ";
        userId?: number;
        timestamp: string;
      }) => {
        if (onMessageStatusUpdate) {
          onMessageStatusUpdate(data);
        }
      },
    );

    socketInstance.on(
      "user:status",
      (data: {
        userId: number;
        status: "online" | "offline";
        lastSeen?: string;
      }) => {
        console.log("👤 User status:", data);
        if (onUserStatusChange) {
          onUserStatusChange(data);
        }
      },
    );

    socketInstance.on("user:typing", (data: TypingIndicator) => {
      if (data.conversationId === conversationId) {
        if (data.isTyping) {
          setTypingUsers((prev) => new Set(prev).add(data.userId));
        } else {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }
      }
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.off("message:received");
      socketInstance.off("message:status");
      socketInstance.off("user:status");
      socketInstance.off("user:typing");
      disconnectSocket();
      hasConnected.current = false;
    };
  }, [
    userId,
    conversationId,
    onMessageReceived,
    onMessageStatusUpdate,
    onUserStatusChange,
  ]);

  const sendMessage = useCallback(
    (content: string, recipientId?: number) => {
      if (!socket) return;

      socket.emit(
        "message:send",
        {
          conversationId,
          recipientId,
          content,
        },
        (response: any) => {
          console.log(response);
          if (
            response.status === "sent" &&
            response.messageId &&
            onMessageSent
          ) {
            const optimisticMessage: Message = {
              id: response.messageId,
              content,
              senderId: userId,
              conversationId: conversationId ?? response.conversationId,
              status: response.messageStatus ?? "PENDING",
              createdAt: new Date().toISOString(),
              Sender: {
                id: userId,
                firstName: user?.firstName ?? "",
                lastName: user?.lastName ?? "",
                avatar: user?.avatar ?? "",
              },
            };
            onMessageSent(optimisticMessage);
          }
        },
      );
    },
    [socket, conversationId, userId, user, onMessageSent],
  );

  const startTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit("typing:start", { conversationId, isTyping: true });
  }, [socket, conversationId]);

  const stopTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit("typing:stop", { conversationId, isTyping: false });
  }, [socket, conversationId]);

  const markMessageAsRead = useCallback(
    (messageId: number, conversationId?: number) => {
      if (!socket || !conversationId) {
        return;
      }

      socket.emit("message:read", { messageId, conversationId });
    },
    [socket],
  );

  const markConversationAsRead = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit("conversation:read", { conversationId });
  }, [socket, conversationId]);

  const checkUserStatus = useCallback(
    (
      userId: number,
    ): Promise<{ userId: number; status: string; online: boolean }> => {
      return new Promise((resolve) => {
        if (!socket) {
          resolve({ userId, status: "offline", online: false });
          return;
        }

        socket.emit("user:status:check", { userId }, (response: any) => {
          resolve(response);
        });
      });
    },
    [socket],
  );

  return {
    socket,
    isConnected,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageAsRead,
    markConversationAsRead,
    checkUserStatus,
  };
};
