"use client";
import { QueryProvider } from "@/components/providers/query-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import type { User } from "@/lib/api/user/types";

interface Providers {
  user: User | null;
  children: React.ReactNode;
}
export function Providers({ user, children }: Readonly<Providers>) {
  return (
    <ReduxProvider user={user}>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}
