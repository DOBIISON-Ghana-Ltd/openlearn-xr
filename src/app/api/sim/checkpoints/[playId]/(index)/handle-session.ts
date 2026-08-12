import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetSessionCheckpoint(playId: string, playerId?: string) {
  const sessionCheckpoints = await prisma.sessionCheckpoint.findMany({
    where: { sessionId: playId, isEnabled: true },
    include: { checkpoint: true },
    orderBy: { checkpoint: { orderIndex: "asc" } },
  });

  const checkpoints = sessionCheckpoints.map((sc) => sc.checkpoint);
  const totalCheckpoints = checkpoints.length;

  if (totalCheckpoints === 0) {
    return JSend.error("No enabled checkpoints found for this session", 404);
  }

  const attempt = await prisma.playAttempt.findFirst({
    where: { sessionId: playId },
  });

  if (!attempt) {
    return JSend.error("Session play attempt not initialized. Please start session navigation first", 404);
  }

  let activeIndex = 0;
  const sessionCheckpointId = attempt.currentCheckpointId;
  if (sessionCheckpointId) {
    const idx = checkpoints.findIndex((c) => c.id === sessionCheckpointId);
    if (idx !== -1) activeIndex = idx;
  }

  const activeCheckpoint = checkpoints[activeIndex] ?? checkpoints[0];

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
      currentCheckpointIndex: activeIndex,
      totalCheckpoints,
      accumulatedPoints: attempt.accumulatedPoints,
    },
  };

  return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
}
