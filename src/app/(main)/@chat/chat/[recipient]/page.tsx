interface ChatPageProps {
  params: Promise<{
    recipient: string;
  }>;
}
export default async function ChatPage({ params }: Readonly<ChatPageProps>) {
  const { recipient } = await params;
  return (
    <div className="flex w-full min-h-screen bg-red-200">
      This is chat to {recipient}
    </div>
  );
}
