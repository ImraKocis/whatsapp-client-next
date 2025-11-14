"use client";

import { useParams } from "next/navigation";
import { ContactItem } from "@/components/contact-list/contact-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ContactItem as ContactItemType } from "@/lib/types/contacts";

interface ContactListProps {
  contacts: ContactItemType[];
}

export function ContactList({ contacts }: Readonly<ContactListProps>) {
  const params = useParams();
  const activeContactId = params.recipientId
    ? Number(params.recipientId)
    : null;

  return (
    <div className="flex flex-col w-full border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>

      <ScrollArea className="flex-1">
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 p-4">
            <p className="text-center">No conversations yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isActive={contact.userId === activeContactId}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
