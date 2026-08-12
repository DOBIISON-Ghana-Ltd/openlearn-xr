import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetLocalCheckpoint(playId: string, checkpointId?: string) {
  const checkpoints = await prisma.moduleCheckpoint.findMany({
    where: { moduleVersionId: playId },
    orderBy: { orderIndex: "asc" },
  });

  const totalCheckpoints = checkpoints.length;

  if (totalCheckpoints === 0) {
    return JSend.error("No checkpoints found for this module version", 404);
  }

  let activeIndex = 0;
  if (checkpointId) {
    const idx = checkpoints.findIndex((c) => c.id === checkpointId);
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
      checkpointId: checkpointId ? null : activeCheckpoint.id,
      currentCheckpointIndex: activeIndex,
      totalCheckpoints,
      accumulatedPoints: 0,
    },
  };

  return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
}
