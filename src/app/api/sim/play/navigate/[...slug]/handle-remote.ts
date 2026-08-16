import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export function handleGetRemoteNav(playId: string) {
  return secureApiRoute<{ slug: string[] }>(async (req, ctx, user) => {
    let attempt = await prisma.playAttempt.findFirst({
      where: {
        moduleVersionId: playId,
        userId: user.id,
        playMode: "module",
      },
    });

    // 1. If attempt does not exist: create fresh attempt at Tab 0 in a transaction
    if (!attempt) {
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

      attempt = await prisma.playAttempt.create({
        data: {
          userId: user.id,
          moduleVersionId: playId,
          playMode: "module",
          currentTab: 0,
          progress: 0,
          accumulatedPoints: 0,
          currentCheckpointId: firstCheckpoint?.id ?? null,
          totalCheckpoints,
        },
      });
    }

    const resData = {
      currentTab: attempt.currentTab,
      progress: attempt.progress,
    };
    return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse(resData));
  });
}

export function handlePostRemoteNav(playId: string, nextTab: number) {
  return secureApiRoute<{ slug: string[] }>(async (req, ctx, user) => {
    const attempt = await prisma.playAttempt.findFirst({
      where: {
        moduleVersionId: playId,
        userId: user.id,
        playMode: "module",
      },
    });

    if (!attempt) {
      return JSend.error("Play attempt not found", 404);
    }

    const progress = Math.round((nextTab / 5) * 100);
    await prisma.playAttempt.update({
      where: { id: attempt.id },
      data: { currentTab: nextTab, progress },
    });

    return JSend.success(
      ZSim.SimGeneralPostNavigate.shape.res.parse("Navigation updated successfully.")
    );
  });
}
