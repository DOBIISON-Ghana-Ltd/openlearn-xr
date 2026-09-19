import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

const ZGetParams = ZSim.SimSessionGetPlayers.shape.params;
const ZGetRes = ZSim.SimSessionGetPlayers.shape.res;

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { id: playId } = ZGetParams.parse(params);

  const players = await prisma.sessionPlayer.findMany({
    where: { session: { joinCode: playId } },
    select: {
      id: true,
      name: true,
      avatar: true,
      joinedAt: true,
      completedAt: true,
      playAttempt: {
        select: {
          accumulatedPoints: true,
          totalCheckpointPoints: true,
          preAssessmentEarnedPoints: true,
          preAssessmentTotalPoints: true,
        },
      },
    },
    orderBy: [
      { playAttempt: { accumulatedPoints: "desc" } },
      { joinedAt: "asc" },
    ],
  });

  const parsedData = ZGetRes.parse(players);

  return JSend.success(parsedData);
});
