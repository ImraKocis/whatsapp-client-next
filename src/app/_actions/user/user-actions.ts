"use server";

import { getUser } from "@/lib/api/user/user";

export async function getUserAction() {
  return await getUser();
}
