import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZApp from "@/data/api/app/app.schema";

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error("No active organization found", 404);
  }

  const org = await prisma.organization.findUnique({
    where: { id: session.activeOrganizationId },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!org) {
    return JSend.error("Organization not found", 404);
  }

  const parsedData = ZApp.AppOrgGetActive.shape.res.parse({
    id: org.id,
    name: org.name,
    logo: org.logo,
    subscriptionTier: org.subscriptions[0]?.tier || "FREE",
  });

  return JSend.success(parsedData);
});
