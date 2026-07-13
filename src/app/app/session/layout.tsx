import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";
import { getActiveOrgSubscription } from "@/lib/actions/get-active-org-subscription";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const res = await auth.api.getSession({
    headers: await headers()
  });

  if (!res || !res.session) {
    redirect("/auth/login?redirect=/app/session");
  }

  const subscriptionTier = await getActiveOrgSubscription(res.session.activeOrganizationId);

  if (subscriptionTier === "FREE") {
    // Free tiers do not have access to the session suite.
    redirect("/app");
  }

  return (
    <>
      {children}
    </>
  );
}
