import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { SessionCookie } from "@/lib/auth/types";

const jwtExpireAt = new Date(Date.now() + 30 * 60 * 1000);
const rtExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export async function createSession(payload: SessionCookie) {
  (await cookies()).set("access-token", payload.accessToken, {
    httpOnly: true,
    secure: true,
    expires: jwtExpireAt,
    sameSite: "lax",
    path: "/",
  });

  (await cookies()).set("refresh-token", payload.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: rtExpireAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete("access-token");
  (await cookies()).delete("refresh-token");
}

export async function getToken(
  type: "access-token" | "refresh-token",
): Promise<string | undefined> {
  return (await cookies()).get(type)?.value;
}

export function createSessionInResponse(
  response: NextResponse,
  payload: SessionCookie,
) {
  const jwtExpireAt = new Date(Date.now() + 30 * 60 * 1000);
  const rtExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  response.cookies.set("access-token", payload.accessToken, {
    httpOnly: true,
    secure: true,
    expires: jwtExpireAt,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("refresh-token", payload.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: rtExpireAt,
    sameSite: "lax",
    path: "/",
  });
}

export function deleteSessionFromResponse(response: NextResponse) {
  response.cookies.delete("jwt-token");
  response.cookies.delete("rt-token");
}
