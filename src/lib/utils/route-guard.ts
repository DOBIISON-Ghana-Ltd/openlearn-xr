import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, UserRole } from "@/adapters/auth/server";
import { getActiveOrgSubscription } from "@/lib/actions/get-active-org-subscription";
import { PATHS } from "@/lib/constants/paths";

export type RouteGuardOptions = {
  /**
   * List of allowed roles (e.g., ['admin', 'editor']).
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

/**
 * Server-side Route Guard for Next.js App Router Server Components (`page.tsx`).
 * Evaluates role permissions and active organization subscription status.
 * Automatically triggers Next.js `redirect()` to `/modules` (or `redirectTo`) if authorization fails.
 */
const DEFAULT_ALLOWED_ROLES: UserRole[] = ["admin", "editor", "user"];

export async function verifyRouteGuard(options: RouteGuardOptions = {}) {
  const {
    roles = DEFAULT_ALLOWED_ROLES,
    requirePaidSubscription = false,
    redirectTo = PATHS.MODULES,
  } = options;

  const reqHeaders = await headers();
  const res = await auth.api.getSession({
    headers: reqHeaders,
  });

  // 1. Session check: redirect if not logged in
  if (!res || !res.user || !res.session) {
    redirect(redirectTo);
  }

  const { user, session } = res;

  // 2. Role check
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

  // 3. Paid subscription check
  let subscription = { tier: "FREE", isUnlimited: false };
  if (requirePaidSubscription) {
    subscription = await getActiveOrgSubscription(session.activeOrganizationId);
    const isFree = String(subscription.tier).toUpperCase() === "FREE" && !subscription.isUnlimited;

    if (isFree) {
      redirect(redirectTo);
    }
  }

  return {
    user,
    session,
    subscription,
  };
}
