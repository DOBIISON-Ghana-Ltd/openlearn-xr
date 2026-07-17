"use server";

import prisma from "@/adapters/db/client";

/**
 * Fetches the active subscription tier for the given organization.
 * Returns "FREE" if not found or if orgId is missing.
 */
export async function getActiveOrgSubscription(orgId: string | null | undefined) {
  if (!orgId) return { tier: "FREE", isUnlimited: false };

  try {
    const sub = await prisma.subscription.findFirst({
      where: { 
        organizationId: orgId,
        status: "ACTIVE" 
      },
      orderBy: { createdAt: 'desc' },
      select: { tier: true, isUnlimited: true }
    });
    return {
      tier: sub?.tier || "FREE",
      isUnlimited: sub?.isUnlimited || false
    };
  } catch (error) {
    console.error("Failed to fetch organization subscription:", error);
    return { tier: "FREE", isUnlimited: false };
  }
}
