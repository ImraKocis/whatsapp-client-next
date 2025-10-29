"use client";

import { User } from "@/types/chat-types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

interface ChatHeaderProps {
  recipient: User;
  isOnline: boolean;
}

export const ChatHeader = ({ recipient, isOnline }: ChatHeaderProps) => {
  const fullName = `${recipient.firstName} ${recipient.lastName}`;
  const initials = `${recipient.firstName[0]}${recipient.lastName[0]}`;

  return (
    <div className="border-b p-4 flex items-center gap-3">
      <Avatar>
        <AvatarImage src={recipient.avatar} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="font-semibold">{fullName}</h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-xs text-gray-500">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};
