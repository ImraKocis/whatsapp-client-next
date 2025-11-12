"use client";
import { ReduxProvider } from "@/components/providers/redux-provider";
import type { User } from "@/lib/api/user/types";

interface Providers {
  user: User | null;
  children: React.ReactNode;
}
export function Providers({ user, children }: Readonly<Providers>) {
  return <ReduxProvider user={user}>{children}</ReduxProvider>;
}
