"use client";

import { useEffect, useRef } from "react";
import { MessageItem } from "@/components/chat/message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types/chat";

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: must track new message and typing
  useEffect(() => {
    if (scrollRef.current) {
      // Find the scrollable viewport inside ScrollArea
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 p-4 max-h-[400px]" ref={scrollRef}>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="flex flex-col-reverse">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
            ))}
          </div>
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
