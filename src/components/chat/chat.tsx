"use client";

import { useState, useCallback, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { User, Message } from "@/types/chat-types";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-inpit";

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

  const handleMessageReceived = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
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

  const {
    isConnected,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageAsRead,
    markConversationAsRead,
  } = useSocket({
    userId: currentUserId,
    conversationId,
    onMessageReceived: handleMessageReceived,
    onMessageStatusUpdate: handleMessageStatusUpdate,
    onUserStatusChange: handleUserStatusChange,
  });

  useEffect(() => {
    if (isConnected && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => msg.senderId === recipient.id && msg.status !== "READ",
      );

      if (unreadMessages.length > 0) {
        const lastMessage = unreadMessages[unreadMessages.length - 1];
        markMessageAsRead(lastMessage!.id);
      }
    }
  }, [messages, isConnected, recipient.id, markMessageAsRead]);

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
        messages={messages}
        currentUserId={currentUserId}
        isTyping={isTyping}
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
