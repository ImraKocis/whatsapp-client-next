import "server-only";

import { cookies } from "next/headers";
import { Session, SessionCookie } from "@/lib/auth/types";
import { NextResponse } from "next/server";

const jwtExpireAt = new Date(Date.now() + 30 * 60 * 1000);
const rtExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export async function createSession(payload: SessionCookie) {
  (await cookies()).set("jwt-token", payload.token, {
    httpOnly: true,
    secure: true,
    expires: jwtExpireAt,
    sameSite: "lax",
    path: "/",
  });

  (await cookies()).set("rt-token", payload.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: rtExpireAt,
    sameSite: "lax",
    path: "/",
  });

  (await cookies()).set("user-id", payload.id.toString(), {
    httpOnly: true,
    secure: true,
    expires: rtExpireAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete("jwt-token");
  (await cookies()).delete("rt-token");
  (await cookies()).delete("user-id");
}

export async function getSession(): Promise<Session> {
  const jwt = (await cookies()).get("jwt-token")?.value;
  const rt = (await cookies()).get("rt-token")?.value;
  return { jwt, rt };
}

export async function getSessionUserId(): Promise<{ id?: string }> {
  const id = (await cookies()).get("user-id")?.value;
  return { id };
}

export function createSessionInResponse(
  response: NextResponse,
  payload: SessionCookie,
) {
  const jwtExpireAt = new Date(Date.now() + 30 * 60 * 1000);
  const rtExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  response.cookies.set("jwt-token", payload.token, {
    httpOnly: true,
    secure: true,
    expires: jwtExpireAt,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("rt-token", payload.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: rtExpireAt,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("user-id", payload.id.toString(), {
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
  response.cookies.delete("user-id");
}
