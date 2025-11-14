"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { MessageItem } from "@/components/chat/message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types/chat";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  isTyping: boolean;
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const MessageList = ({
  messages,
  currentUserId,
  isTyping,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: MessageListProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(loadMoreTriggerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore scroll method
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  const sortedMessages = [...messages].reverse();

  return (
    <ScrollArea className="h-[700px]">
      <div className="flex flex-1 flex-col h-full px-4" ref={chatContainerRef}>
        <div
          ref={topRef}
          className="flex flex-col justify-center items-center py-2"
        >
          {hasMore && <div ref={loadMoreTriggerRef} className="h-1 w-full" />}
          {isLoadingMore && (
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          )}
        </div>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          sortedMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}

        {isTyping && (
          <div className="flex gap-2 items-center text-gray-500 text-sm mt-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <span>Typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
