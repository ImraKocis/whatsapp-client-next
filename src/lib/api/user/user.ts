import config from "@/config";
import type { User } from "@/lib/api/user/types";
import { getToken } from "@/lib/auth/session";

export async function getUser(): Promise<User | null> {
  const token = await getToken("access-token");
  if (!token) return null;
  const response = await fetch(`${config.BASE_API_URL}/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) return await response.json();
  return null;
}
