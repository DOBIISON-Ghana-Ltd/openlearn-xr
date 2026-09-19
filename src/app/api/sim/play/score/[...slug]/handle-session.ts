import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

const ZGetRes = ZSim.SimGeneralGetScore.shape.res;

export async function handleGetSessionScore(playId: string, playerId: string) {
  if (!playerId) {
    return JSend.error("Player ID is required for session score", 400);
  }

  const attempt = await prisma.playAttempt.findUnique({
    where: { sessionPlayerId: playerId },
    select: { accumulatedPoints: true },
  });

  const score = attempt?.accumulatedPoints ?? 0;
  const resData = { score };
  return JSend.success(ZGetRes.parse(resData));
}
