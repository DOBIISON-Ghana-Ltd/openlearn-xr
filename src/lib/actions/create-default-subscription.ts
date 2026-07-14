import prisma from "@/adapters/db/client";

/**
 * Creates a default FREE subscription for a newly created organization.
 */
export async function createDefaultSubscription(organizationId: string) {
  try {
    await prisma.subscription.create({
      data: {
        organizationId,
        tier: "FREE",
        status: "ACTIVE",
        seats: 1,
      },
    });
  } catch (error) {
    console.error(`[createDefaultSubscription] Failed to create subscription for org ${organizationId}:`, error);
    throw error;
  }
}
