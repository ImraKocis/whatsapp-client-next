import { ContactListServerWrapper } from "@/components/contact-list/contact-list-server-wrapper";

export default function MainCoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col grow">
      <div className="flex w-full grow">
        <ContactListServerWrapper />
        {children}
      </div>
    </div>
  );
}
