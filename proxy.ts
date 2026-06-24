// proxy.ts
import { NextRequest, NextResponse, ProxyConfig } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";
import { env } from "@/lib/config/env";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  let cache = null;
  try {
    cache = await getCookieCache(request, {
      secret: env.BETTER_AUTH_SECRET,
    });
  } catch { }

  const hasAuth = Boolean(cache);
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ].includes(pathname);
  const isOnboarding = pathname.startsWith("/onboarding");
  const isVerifyPage = pathname.startsWith("/verify");
  const isMeRoute = pathname.startsWith("/me");
  const isAdminRoute = pathname.startsWith("/admin");
  const isIndexPage = pathname === "/";
  const isProtectedRoute = isMeRoute || isAdminRoute || isOnboarding;
  const isOnboarded = Boolean(cache?.user?.onboarded);

  if (!hasAuth && sessionCookie && !isVerifyPage) {
    const verifyUrl = new URL("/verify", request.url);
    verifyUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(verifyUrl);
  }

  if (hasAuth && (isAuthPage || isVerifyPage || isIndexPage)) {
    return NextResponse.redirect(new URL("/modules", request.url));
  }

  if (!hasAuth && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (hasAuth && (isMeRoute || isAdminRoute) && !isOnboarded) {
    const onboardingUrl = new URL("/onboarding", request.url);
    onboardingUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(onboardingUrl);
  }

  if (hasAuth && isOnboarding && isOnboarded) {
    return NextResponse.redirect(new URL("/modules", request.url));
  }

  if (hasAuth && isAdminRoute) {
    const roles = String(cache?.user?.role || "")
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    if (!roles.includes("admin")) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }
  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    "/",
    "/me",
    "/me/:path*",
    "/admin",
    "/admin/:path*",

    // Auth routes
    "/verify",
    "/forgot-password",
    "/reset-password",
    "/login",
    "/register",
    "/verify-email",
    "/onboarding",
  ],
};