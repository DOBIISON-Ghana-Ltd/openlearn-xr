import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";

const ZGetParams = ZSes.SesAnalyticsGetPlayers.shape.params;
const ZGetRes = ZSes.SesAnalyticsGetPlayers.shape.res;

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user, session) => {
  const { id } = ZGetParams.parse(await ctx.params);

  const players = await prisma.sessionPlayer.findMany({
    where: {
      sessionId: id,
      session: {
        hostId: user.id,
      },
    },
    orderBy: {
      playAttempt: {
        accumulatedPoints: "desc",
      }
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      user: {
        select: {
          image: true,
        },
      },
      playAttempt: {
        select: {
          accumulatedPoints: true,
          totalCheckpointPoints: true,
          preAssessmentEarnedPoints: true,
          preAssessmentTotalPoints: true,
        },
      },
    },
  });

  const parsedData = ZGetRes.parse(players);
  return JSend.success(parsedData);
});
