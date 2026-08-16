import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export function handleGetRemoteCheckpoint(playId: string) {
  return secureApiRoute<{ playId: string }>(async (req, ctx, user) => {
    const userId = user.id;

    const attempt = await prisma.playAttempt.findFirst({
      where: { userId, moduleVersionId: playId, playMode: "module" },
    });

    if (!attempt) {
      return JSend.error("Play attempt not initialized.", 404);
    }

    const checkpointId = attempt.currentCheckpointId;
    const activeCheckpoint = await prisma.moduleCheckpoint.findUnique({ where: { id: checkpointId || "" } });

    if (!activeCheckpoint) {
      return JSend.error("No checkpoints found for this module version", 404);
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
        currentCheckpointIndex: attempt.currentCheckpointIndex,
        totalCheckpoints: attempt.totalCheckpoints,
        accumulatedPoints: attempt.accumulatedPoints,
      },
    };

    return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
  });
}
