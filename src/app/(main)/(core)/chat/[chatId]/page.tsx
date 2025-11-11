interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}
export default async function Page({ params }: Readonly<PageProps>) {
  const { chatId } = await params;
  return <div>Page {chatId}</div>;
}
