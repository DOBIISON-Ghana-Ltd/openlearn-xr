import { NextRequest, NextResponse, ProxyConfig } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";
import { env } from "@/lib/config/env";
import { PATHS } from "@/lib/constants/paths";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = getSessionCookie(request);
  let cache: any = null;
  try {
    cache = await getCookieCache(request, {
      secret: env.BETTER_AUTH_SECRET,
    });
  } catch {}

  const hasAuth = Boolean(sessionCookie || cache);

  // Redirect authenticated users away from auth pages to /modules
  if (hasAuth && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL(PATHS.MODULES, request.url));
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    "/auth/:path*",
  ],
};