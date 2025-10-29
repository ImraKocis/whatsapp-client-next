"use client";

import { Message } from "@/types/chat-types";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

interface MessageItemProps {
  message: Message;
  currentUserId: number;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const isOwn = message.senderId === currentUserId;
  const senderName = message.sender
    ? `${message.sender.firstName} ${message.sender.lastName}`
    : "Unknown";
  const initials = message.sender
    ? `${message.sender.firstName[0]}${message.sender.lastName[0]}`
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
      className={cn("flex gap-3 mb-4", isOwn ? "flex-row-reverse" : "flex-row")}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender?.avatar} />
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
            {new Date(message.createdAt).toLocaleTimeString("en-US", {
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
