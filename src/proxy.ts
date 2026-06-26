// proxy.ts
import { NextRequest, NextResponse, ProxyConfig } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";
import { env } from "@/lib/config/env";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  console.log("Passed Proxy Middleware:", pathname);

  const sessionCookie = getSessionCookie(request);
  let cache: any = null;
  try {
    cache = await getCookieCache(request, {
      secret: env.BETTER_AUTH_SECRET,
    });
  } catch { }

  const hasAuth = Boolean(cache);
  const user = cache?.user;

  // Extract roles (e.g., "user,admin" -> ["user", "admin"])
  const roles = String(user?.role || "")
    .split(",")
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);

  // Extract subscription tier (fallback to 'free' if not set)
  const subscriptionTier = String(user?.subscriptionTier || user?.plan || user?.subscription || "free").toLowerCase();

  const isOnboarded = Boolean(user?.onboarded);

  // --- Route Definitions ---
  const isVerifyPage = pathname.startsWith("/auth/verify");
  const isOnboardingPage = pathname.startsWith("/auth/onboarding");
  const isIndexPage = pathname === "/";
  const isAuthPage = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
  ].includes(pathname);

  // --- Suite Definitions ---
  const isAdminSuite = pathname.startsWith("/app/admin");
  const isEditorSuite = pathname.startsWith("/app/editor");
  const isSessionSuite = pathname.startsWith("/app/session");
  const isAppRoute = pathname.startsWith("/app");

  // --- Auth Flow Logic ---

  // 1. Handle missing cache but present session cookie (Needs Verification)
  if (!hasAuth && sessionCookie && !isVerifyPage) {
    const verifyUrl = new URL("/auth/verify", request.url);
    verifyUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(verifyUrl);
  }

  // 2. Redirect logged-in users away from auth/index pages
  if (hasAuth && (isAuthPage || isVerifyPage || isIndexPage)) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // 3. Handle Onboarding flow
  /*
  if (hasAuth) {
    if (!isOnboarded && !isOnboardingPage) {
      const onboardingUrl = new URL("/auth/onboarding", request.url);
      onboardingUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(onboardingUrl);
    }
    if (isOnboarded && isOnboardingPage) {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }
  */

  // --- Suite Authorization Logic ---
  if (isAppRoute) {
    // Admin, Editor, and Session suites are protected.
    // The rest of /app (Simulation suite) requires NO auth.
    const isProtectedSuite = isAdminSuite || isEditorSuite || isSessionSuite;

    if (isProtectedSuite) {
      // 1. Must be logged in for protected suites
      if (!hasAuth) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathname + search);
        return NextResponse.redirect(loginUrl);
      }

      // 2. Suite-specific authorization checks
      if (isAdminSuite && !roles.includes("admin")) {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }

      if (isEditorSuite && !roles.includes("admin") && !roles.includes("editor")) {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }

      if (isSessionSuite && subscriptionTier === "free") {
        // Only non-free subscription tiers are allowed
        return NextResponse.redirect(new URL("/not-found", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    "/",
    "/auth/:path*",
    "/app/:path*"
  ]
};