import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetSessionScore(playId: string, playerId: string) {
  if (!playerId) {
    return JSend.error("Player ID is required for session score", 400);
  }

  const player = await prisma.sessionPlayer.findUnique({
    where: { id: playerId },
    select: { score: true },
  });

  const score = player?.score ?? 0;
  const resData = { score, moduleId: undefined };
  return JSend.success(ZSim.SimGeneralGetScore.shape.res.parse(resData));
}
