import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createSessionInResponse,
  deleteSessionFromResponse,
} from "@/lib/auth/session";

const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const jwtToken = request.cookies.get("access-token")?.value;
  const rtToken = request.cookies.get("refresh-token")?.value;

  if (!isPublicRoute && !jwtToken && !rtToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && (jwtToken || rtToken)) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (!jwtToken && rtToken && !isPublicRoute) {
    try {
      const response = await fetch(
        `${process.env.WEB_BASE_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${rtToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const nextResponse = NextResponse.next();
        createSessionInResponse(nextResponse, {
          accessToken: data.token,
          refreshToken: data.refreshToken,
          id: data.id,
        });

        return nextResponse;
      } else {
        const loginUrl = new URL("/login", request.url);
        const nextResponse = NextResponse.redirect(loginUrl);
        deleteSessionFromResponse(nextResponse);
        return nextResponse;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      const loginUrl = new URL("/login", request.url);
      const nextResponse = NextResponse.redirect(loginUrl);
      deleteSessionFromResponse(nextResponse);
      return nextResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "next-action" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
