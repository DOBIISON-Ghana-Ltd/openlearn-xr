import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetLocalCheckpoint(playId: string, checkpointId?: string) {
  if (!checkpointId) {
    return JSend.error("checkpointId is required for local mode", 400);
  }

  const activeCheckpoint = await prisma.moduleCheckpoint.findUnique({
    where: { id: checkpointId },
  });

  if (!activeCheckpoint) {
    return JSend.error("Checkpoint not found", 404);
  }

  const totalCheckpoints = await prisma.moduleCheckpoint.count({
    where: { moduleVersionId: playId },
  });

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
      totalCheckpoints,
      accumulatedPoints: 0,
    },
  };

  return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
}
