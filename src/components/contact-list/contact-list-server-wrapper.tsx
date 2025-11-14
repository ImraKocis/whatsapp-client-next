import { ContactList } from "@/components/contact-list/contact-list";
import { apiGet } from "@/lib/api/api-client";
import type { ContactItem } from "@/lib/types/contacts";

export async function ContactListServerWrapper() {
  const contacts = await apiGet<ContactItem[]>("user/contacts", {
    next: { tags: ["contacts"] },
  });

  console.log(contacts);

  return (
    <div className="flex grow w-[500px]">
      <ContactList contacts={contacts ?? []} />
    </div>
  );
}
