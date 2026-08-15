import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export function handlePostRemoteRetake(playId: string) {
  return secureApiRoute<{ slug: string[] }>(async (req, ctx, user) => {
    const attempt = await prisma.playAttempt.findFirst({
      where: {
        moduleVersionId: playId,
        userId: user.id,
        playMode: "module",
      },
    });

    if (!attempt) {
      return JSend.error("Play attempt not initialized.", 404);
    }

    const [firstCheckpoint, totalCheckpoints] = await prisma.$transaction([
      prisma.moduleCheckpoint.findFirst({
        where: { moduleVersionId: playId },
        orderBy: { orderIndex: "asc" },
        select: { id: true },
      }),
      prisma.moduleCheckpoint.count({
        where: { moduleVersionId: playId },
      }),
    ]);

    await prisma.playAttempt.update({
      where: { id: attempt.id },
      data: {
        currentTab: 0,
        progress: 0,
        currentCheckpointIndex: 0,
        accumulatedPoints: 0,
        currentCheckpointId: firstCheckpoint?.id ?? null,
        totalCheckpoints,
      },
    });

    const resData = {
      checkpointId: firstCheckpoint?.id ?? null,
      totalCheckpoints,
    };

    return JSend.success(ZSim.SimGeneralPostRetake.shape.res.parse(resData));
  });
}
