import { NextRequest } from "next/server";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";
import ZApp from "@/data/api/app/app.schema";

export const GET = secureApiRoute(async (req: NextRequest, ctx, user) => {
  const { orgId } = (await ctx.params) as { orgId: string };

  const member = await prisma.member.findFirst({
    where: { userId: user.id, organizationId: orgId },
  });

  if (!member) {
    return JSend.error("Forbidden", 403);
  }

  const subscription = await prisma.subscription.findFirst({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    return JSend.error("Subscription not found", 404);
  }

  const parsed = ZApp.AppOrgGetSubscription.shape.res.parse({
    id: subscription.id,
    status: subscription.status,
    seats: subscription.seats,
    isUnlimited: subscription.isUnlimited,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
  });

  return JSend.success(parsed);
});
