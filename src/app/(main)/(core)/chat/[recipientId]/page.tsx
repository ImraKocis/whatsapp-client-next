import { notFound } from "next/navigation";
import { Chat } from "@/components/chat/chat";
import { apiGet } from "@/lib/api/api-client";
import type { User } from "@/lib/api/user/types";
import { getUser } from "@/lib/api/user/user";
import type { Conversation, Message } from "@/lib/types/chat";

interface PageProps {
  params: Promise<{
    recipientId: string;
  }>;
}
export default async function Page({ params }: Readonly<PageProps>) {
  const { recipientId } = await params;
  const recipientIdNum = Number(recipientId);
  if (Number.isNaN(recipientIdNum)) {
    notFound();
  }

  const currentUser = await getUser();
  if (!currentUser) {
    console.error("Current user not found");
    notFound();
  }
  const [recipient, conversationData] = await Promise.all([
    apiGet<User>(
      `user/${recipientId}`,
      //     {
      //   next: { tags: [`recipient-${recipientId}`] },
      // }
    ),
    apiGet<{
      exists: boolean;
      conversation: Conversation | null;
    }>(
      `conversation/direct/${currentUser.id}/${recipientId}`,
      //     {
      //   next: { tags: [`conversation-${currentUser.id}-${recipientId}`] },
      // }
    ),
  ]);

  if (!recipient) {
    console.error("Recipient not found", recipientId);
    notFound();
  }

  let initialMessages: Message[] = [];
  let conversationId: number | undefined;

  if (conversationData?.exists && conversationData.conversation?.id) {
    conversationId = conversationData.conversation.id;

    const messagesData = await apiGet<{
      conversationId: number;
      messages: Message[];
      count: number;
    }>(`conversation/${conversationId}/messages?limit=10&offset=0`, {
      next: { tags: [`messages-${conversationId}`] },
    });

    initialMessages = messagesData?.messages || [];
  }

  return (
    <div className="p-10">
      <Chat
        currentUserId={currentUser.id}
        recipient={recipient}
        initialMessages={initialMessages}
        conversationId={conversationId}
      />
    </div>
  );
}
