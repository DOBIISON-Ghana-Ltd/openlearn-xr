import { NextRequest } from "next/server";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";

// GET /api/org/:orgId/subscription
export const GET = secureApiRoute(async (req: NextRequest, ctx, user) => {
  const { orgId } = await ctx.params as { orgId: string };

  // Verify the user actually belongs to this org before returning its subscription
  const member = await prisma.member.findFirst({
    where: { userId: user.id, organizationId: orgId },
  });

  if (!member) {
    return JSend.error("Forbidden", 403);
  }

  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
  });

  return JSend.success(subscription);
});
