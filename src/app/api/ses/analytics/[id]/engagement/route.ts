import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";

const ZGetParams = ZSes.SesAnalyticsGetEngagement.shape.params;
const ZGetRes = ZSes.SesAnalyticsGetEngagement.shape.res;

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user) => {
  const { id } = ZGetParams.parse(await ctx.params);

  const analytics = await prisma.sessionAnalytic.findMany({
    where: {
      sessionId: id
    },
    orderBy: {
      recordedAt: "asc",
    },
    select: {
      id: true,
      sessionId: true,
      playerId: true,
      event: true,
      payload: true,
      recordedAt: true,
    },
  });

  const parsedData = ZGetRes.parse(analytics);
  return JSend.success(parsedData);
});
