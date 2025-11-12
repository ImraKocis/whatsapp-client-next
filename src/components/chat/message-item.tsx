"use client";

import { Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Message } from "@/lib/types/chat";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  currentUserId: number;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const isOwn = message.senderId === currentUserId;
  const senderName = message.Sender
    ? `${message.Sender.firstName} ${message.Sender.lastName}`
    : "Unknown";
  const initials = message.Sender
    ? `${message.Sender.firstName[0]}${message.Sender.lastName[0]}`
    : "?";

  const getStatusIcon = () => {
    switch (message.status) {
      case "DELIVERED":
        return <Check className="h-3 w-3" />;
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
        isOwn ? "flex-row" : "flex-row-reverse",
      )}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.Sender?.avatar} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {!isOwn && (
          <span className="text-xs text-gray-500 mb-1">{senderName}</span>
        )}

        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isOwn
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
          )}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString("hr-HR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isOwn && <span className="text-gray-500">{getStatusIcon()}</span>}
        </div>
      </div>
    </div>
  );
};
