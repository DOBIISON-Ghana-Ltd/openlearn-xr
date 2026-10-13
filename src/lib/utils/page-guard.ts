import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, UserRole } from "@/adapters/auth/server";
import { getActiveOrgSubscription } from "@/lib/actions/get-active-org-subscription";
import { PATHS } from "@/lib/constants/paths";

export type PageGuardOptions = {
  /**
   * List of allowed roles (e.g., ['admin', 'editor', 'user']).
   * If specified, the user must have at least one of these roles.
   */
  roles?: UserRole[];
  /**
   * If true, the user's active organization subscription tier must not be 'FREE'.
   */
  requirePaidSubscription?: boolean;
  /**
   * Target URL to redirect to if authorization fails. Defaults to PATHS.MODULES ('/modules').
   */
  redirectTo?: string;
};

const DEFAULT_ALLOWED_ROLES: UserRole[] = ["admin", "editor", "user"];

/**
 * Server-side Page Guard for Next.js App Router Root Layout & Server Pages.
 * - If on public auth pages (/auth/login, /auth/register, etc.), skips session check.
 * - If on /auth/onboarding:
 *   - Unauthenticated -> redirects to /auth/login?redirect=/auth/onboarding
 *   - Authenticated & onboarded -> redirects to /modules
 *   - Authenticated & un-onboarded -> allows pass
 * - If on any other route:
 *   - Authenticated & un-onboarded -> redirects to /auth/onboarding?redirect=${pathname}
 *   - Unauthenticated on protected route -> redirects to /auth/login?redirect=${pathname}
 */
export async function pageGuard(options: PageGuardOptions = {}) {
  const {
    roles = DEFAULT_ALLOWED_ROLES,
    requirePaidSubscription = false,
    redirectTo = PATHS.MODULES,
  } = options;

  const reqHeaders = await headers();
  const pathname = reqHeaders.get("x-pathname") || "";
  console.log(pathname);

  // 1. Skip public auth pages (proxy guarantees only unauthenticated reach here)
  if (pathname.startsWith("/auth/") && pathname !== PATHS.AUTH.ONBOARDING) {
    return null;
  }

  // 2. Fetch session from Better Auth
  const res = await auth.api.getSession({
    headers: reqHeaders,
  });

  const user = res?.user;
  const session = res?.session;

  // 3. Onboarding route check
  if (pathname === PATHS.AUTH.ONBOARDING) {
    if (!user || !session) {
      redirect(`${PATHS.AUTH.LOGIN}?redirect=${encodeURIComponent(PATHS.AUTH.ONBOARDING)}`);
    }

    if (user.onboarded) {
      redirect(PATHS.MODULES);
    }

    return { user, session, subscription: { tier: "FREE", isUnlimited: false } };
  }

  // 4. Authenticated user checks across all routes
  if (user && session) {
    // If user is not yet onboarded, redirect to onboarding with return path
    if (!user.onboarded) {
      const redirectQuery = pathname && pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : "";
      redirect(`${PATHS.AUTH.ONBOARDING}${redirectQuery}`);
    }

    // Role check (if specified)
    if (roles && roles.length > 0) {
      const userRoles = String(user.role || "")
        .split(",")
        .map((r) => r.trim().toLowerCase())
        .filter(Boolean);

      const hasRequiredRole = roles.some((reqRole) =>
        userRoles.includes(reqRole.toLowerCase())
      );

      if (!hasRequiredRole) {
        redirect(redirectTo);
      }
    }

    // Paid subscription check (if requested)
    let subscription = { tier: "FREE", isUnlimited: false };
    if (requirePaidSubscription) {
      subscription = await getActiveOrgSubscription(session.activeOrganizationId);
      const isFree = String(subscription.tier).toUpperCase() === "FREE" && !subscription.isUnlimited;

      if (isFree) {
        redirect(redirectTo);
      }
    }

    return { user, session, subscription };
  }

  // 5. Unauthenticated user on protected routes
  if (
    pathname.startsWith("/teaching") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/app/admin")
  ) {
    const redirectQuery = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
    redirect(`${PATHS.AUTH.LOGIN}${redirectQuery}`);
  }

  return null;
}
