import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export function handleGetRemoteCheckpoint(playId: string) {
  return secureApiRoute<{ playId: string }>(async (req, ctx, user) => {
    const userId = user.id;

    const checkpoints = await prisma.moduleCheckpoint.findMany({
      where: { moduleVersionId: playId },
      orderBy: { orderIndex: "asc" },
    });

    const totalCheckpoints = checkpoints.length;

    if (totalCheckpoints === 0) {
      return JSend.error("No checkpoints found for this module version", 404);
    }

    const attempt = await prisma.playAttempt.findFirst({
      where: { userId, moduleVersionId: playId, playMode: "module" },
    });

    if (!attempt) {
      return JSend.error("Play attempt not initialized. Please start lesson navigation first", 404);
    }

    let activeIndex = 0;
    const currentCheckpointId = attempt.currentCheckpointId;
    if (currentCheckpointId) {
      const idx = checkpoints.findIndex((c) => c.id === currentCheckpointId);
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
  });
}
