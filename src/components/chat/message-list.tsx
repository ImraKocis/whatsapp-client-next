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
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);
  const previousMessageCount = useRef<number>(0);

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

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );

      if (!viewport) return;

      const currentScrollHeight = viewport.scrollHeight;
      const messageCountIncreased =
        messages.length > previousMessageCount.current;

      if (messageCountIncreased && previousScrollHeight.current > 0) {
        viewport.scrollTop = currentScrollHeight - previousScrollHeight.current;
      } else if (previousMessageCount.current === 0 || !messageCountIncreased) {
        viewport.scrollTop = viewport.scrollHeight;
      }

      previousMessageCount.current = messages.length;
      previousScrollHeight.current = currentScrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    if (isTyping && scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [isTyping]);

  const sortedMessages = [...messages].reverse();

  return (
    <ScrollArea className="flex-1 p-4 max-h-[400px]" ref={scrollRef}>
      <div className="space-y-4">
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
            <span>typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
