import prisma from "@/adapters/db/client";
import ZAdmin from "@/data/api/admin/admin.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

const ZGetRes = ZAdmin.AdminSubscriptionGetAll.shape.res;

export const GET = secureApiRoute(async (req, ctx, user) => {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsed = ZGetRes.parse(subscriptions);

  return JSend.success(parsed);
});
