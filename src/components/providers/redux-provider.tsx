import { useRef } from "react";
import { Provider } from "react-redux";
import type { User } from "@/lib/api/user/types";
import { setUser } from "@/lib/redux/features/userSlice";
import { type AppStore, makeStore } from "@/lib/redux/store";

interface ReduxProvider {
  user: User | null;
  children: React.ReactNode;
}
export function ReduxProvider({ user, children }: Readonly<ReduxProvider>) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(setUser(user));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
