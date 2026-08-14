import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetSessionCheckpoint(playId: string, playerId: string) {
  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: playId },
    select: { id: true },
  });

  if (!liveSession) {
    return JSend.error("Live session not found", 404);
  }

  const attempt = await prisma.playAttempt.findUnique({ where: { sessionPlayerId: playerId } })

  if (!attempt) {
    return JSend.error("Session play attempt not initialized.", 404);
  }

  const checkpointId = attempt.currentCheckpointId;
  const activeCheckpoint = await prisma.moduleCheckpoint.findUnique({ where: { id: checkpointId || "" } });

  if (!activeCheckpoint) {
    return JSend.error("No enabled checkpoints found for this session", 404);
  }

  const resData = {
    checkpoint: {
      question: activeCheckpoint.question,
      options: activeCheckpoint.options,
      points: activeCheckpoint.points,
      orderIndex: activeCheckpoint.orderIndex,
      hint: activeCheckpoint.hint,
    },
    meta: {
      checkpointId: null,
      currentCheckpointIndex: Math.max(0, activeCheckpoint.orderIndex - 1),
      totalCheckpoints: attempt.totalCheckpoints,
      accumulatedPoints: attempt.accumulatedPoints,
    },
  };

  return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
}
