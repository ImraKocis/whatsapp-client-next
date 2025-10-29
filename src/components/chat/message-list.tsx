"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/chat-types";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { MessageItem } from "@/components/chat/message-item";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  isTyping: boolean;
}

export const MessageList = ({
  messages,
  currentUserId,
  isTyping,
}: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div ref={scrollRef} className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}

        {isTyping && (
          <div className="flex gap-2 items-center text-gray-500 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
            <span>typing...</span>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
