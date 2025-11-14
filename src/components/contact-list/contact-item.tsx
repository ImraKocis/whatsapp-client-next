"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useContactListItem } from "@/hooks/contact-list/useContactListItem";
import type { ContactItem as ContactItemType } from "@/lib/types/contacts";
import { cn } from "@/lib/utils";

interface ContactItemProps {
  contact: ContactItemType;
  isActive?: boolean;
}

export function ContactItem({ contact, isActive }: Readonly<ContactItemProps>) {
  const { formatTimestamp, getInitials, truncateMessage } =
    useContactListItem();

  return (
    <Link
      href={`/chat/${contact.userId}`}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors min-w-[500px]",
        isActive && "bg-gray-100",
      )}
    >
      {/* Avatar */}
      <Avatar className="h-12 w-12">
        <AvatarImage src={contact.avatar ?? undefined} alt={contact.name} />
        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and Time */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
          {contact.lastMessage && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatTimestamp(contact.lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-sm text-gray-600 truncate">
            {contact.lastMessage ? (
              <>
                {contact.type === "GROUP" && contact.lastMessage.senderName && (
                  <span className="font-medium">
                    {contact.lastMessage.senderName}:{" "}
                  </span>
                )}
                {truncateMessage(contact.lastMessage.content)}
              </>
            ) : (
              <span className="text-gray-400 italic">No messages yet</span>
            )}
          </p>

          {contact.unreadCount > 0 && (
            <Badge
              variant="default"
              className="flex-shrink-0 h-5 min-w-5 px-1.5 text-xs"
            >
              {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
