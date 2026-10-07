import { NextRequest, NextResponse, ProxyConfig } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";
import { env } from "@/lib/config/env";
import { PATHS } from "@/lib/constants/paths";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const sessionCookie = getSessionCookie(request);
  let cache: any = null;
  try {
    cache = await getCookieCache(request, {
      secret: env.BETTER_AUTH_SECRET,
    });
  } catch { }

  const hasAuth = Boolean(sessionCookie || cache);

  if (pathname.startsWith("/auth/")) {
    const isOnboarding = pathname === PATHS.AUTH.ONBOARDING;

    if (isOnboarding && !hasAuth) {
      return NextResponse.redirect(
        new URL(`${PATHS.AUTH.LOGIN}?redirect=${encodeURIComponent(PATHS.AUTH.ONBOARDING)}`, request.url)
      );
    }

    if (!isOnboarding && hasAuth) {
      return NextResponse.redirect(new URL(PATHS.MODULES, request.url));
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config: ProxyConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};