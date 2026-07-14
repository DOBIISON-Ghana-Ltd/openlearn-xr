"use server";

import prisma from "@/adapters/db/client";

/**
 * Fetches the active subscription tier for the given organization.
 * Returns "FREE" if not found or if orgId is missing.
 */
export async function getActiveOrgSubscription(orgId: string | null | undefined) {
  if (!orgId) return "FREE";

  try {
    const sub = await prisma.subscription.findFirst({
      where: { 
        organizationId: orgId,
        status: "ACTIVE" 
      },
      orderBy: { createdAt: 'desc' },
      select: { tier: true }
    });
    return sub?.tier || "FREE";
  } catch (error) {
    console.error("Failed to fetch organization subscription:", error);
    return "FREE";
  }
}
