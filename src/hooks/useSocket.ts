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
    // Prevent double connection in React Strict Mode
    if (hasConnected.current) return;
    hasConnected.current = true;

    const socketInstance = getSocket(userId);
    setSocket(socketInstance);

    // Connection events
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

    // Message events - delegate to callbacks
    socketInstance.on("message:received", (message: Message) => {
      console.log("📨 Message received:", message);
      if (onMessageReceived) {
        onMessageReceived(message);
      }
    });

    // Message status updates - AUTOMATIC from backend
    socketInstance.on(
      "message:status",
      (data: {
        messageId: number;
        status: "PENDING" | "DELIVERED" | "READ";
        userId?: number;
        timestamp: string;
      }) => {
        console.log("✓ Message status update:", data);
        if (onMessageStatusUpdate) {
          onMessageStatusUpdate(data);
        }
      },
    );

    // User status events
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

    // Typing events
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

    // Cleanup
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
          console.log("📤 Message sent:", response);

          // ✅ Call the callback with optimistic message
          if (
            response.status === "sent" &&
            response.messageId &&
            onMessageSent
          ) {
            const optimisticMessage: Message = {
              id: response.messageId,
              content,
              senderId: userId,
              conversationId: conversationId || response.conversationId,
              status: "PENDING",
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
    (messageId: number) => {
      if (!socket || !conversationId) return;
      socket.emit("message:read", { messageId, conversationId });
    },
    [socket, conversationId],
  );

  const markConversationAsRead = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit("conversation:read", { conversationId });
  }, [socket, conversationId]);

  return {
    socket,
    isConnected,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageAsRead,
    markConversationAsRead,
  };
};
