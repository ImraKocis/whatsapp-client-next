"use client";

import { Check, CheckCheck } from "lucide-react";
import { MessageContent } from "@/components/chat/message-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Message } from "@/lib/types/chat";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  currentUserId: number;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const isOwn = message.senderId === currentUserId;

  const getStatusIcon = () => {
    switch (message.status) {
      case "DELIVERED":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "READ":
        return <CheckCheck className="h-3 w-3 text-blue-600" />;
      default:
        return <Check className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 mb-4",
        isOwn ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.Sender?.avatar} />
          <AvatarFallback>{`${message.Sender?.firstName[0]}${message.Sender?.lastName[0]}`}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {!isOwn && (
          <span className="text-xs text-gray-500 mb-1">{`${message.Sender?.firstName} ${message.Sender?.lastName}`}</span>
        )}

        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isOwn
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
          )}
        >
          <MessageContent content={message.content} />
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isOwn && <span>{getStatusIcon()}</span>}
        </div>
      </div>
    </div>
  );
};
