import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";

const ZGetParams = ZSes.SesAnalyticsGetCheckpoints.shape.params;
const ZGetRes = ZSes.SesAnalyticsGetCheckpoints.shape.res;

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user) => {
  const { id } = ZGetParams.parse(await ctx.params);

  const checkpoints = await prisma.sessionCheckpoint.findMany({
    where: {
      sessionId: id,
      session: {
        hostId: user.id,
      },
    },
    orderBy: {
      checkpoint: {
        orderIndex: "asc",
      },
    },
    select: {
      id: true,
      isEnabled: true,
      checkpoint: {
        select: {
          id: true,
          question: true,
          options: true,
          correctAnswer: true,
          points: true,
          explanation: true,
          hint: true,
        },
      },
    },
  });

  const parsedData = ZGetRes.parse(checkpoints);
  return JSend.success(parsedData);
});
