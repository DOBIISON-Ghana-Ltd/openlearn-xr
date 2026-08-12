import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export function handleGetRemoteNav(playId: string) {
  return secureApiRoute<{ slug: string[] }>(async (req, ctx, user) => {
    const attempt = await prisma.playAttempt.findFirst({
      where: {
        moduleVersionId: playId,
        userId: user.id,
        playMode: "module",
      },
      select: { currentTab: true, progress: true },
    });

    const currentTab = attempt?.currentTab ?? 0;
    const progress = attempt?.progress ?? Math.round((currentTab / 5) * 100);

    const resData = { currentTab, progress };
    return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse(resData));
  });
}

export function handlePostRemoteNav(playId: string, nextTab: number) {
  return secureApiRoute<{ slug: string[] }>(async (req, ctx, user) => {
    const progress = Math.round((nextTab / 5) * 100);

    let attempt = await prisma.playAttempt.findFirst({
      where: {
        moduleVersionId: playId,
        userId: user.id,
        playMode: "module",
      },
    });

    // If existing attempt is completed (progress === 100) or user restarts (nextTab === 0), delete old attempt
    if (attempt && (attempt.progress === 100 || nextTab === 0)) {
      await prisma.playAttempt.delete({
        where: { id: attempt.id },
      });
      attempt = null;
    }

    if (attempt) {
      await prisma.playAttempt.update({
        where: { id: attempt.id },
        data: { currentTab: nextTab, progress },
      });
    } else {
      const firstCheckpoint = await prisma.moduleCheckpoint.findFirst({
        where: { moduleVersionId: playId },
        orderBy: { orderIndex: "asc" },
        select: { id: true },
      });

      await prisma.playAttempt.create({
        data: {
          userId: user.id,
          moduleVersionId: playId,
          playMode: "module",
          currentTab: nextTab,
          progress,
          currentCheckpointId: firstCheckpoint?.id ?? null,
        },
      });
    }

    return JSend.success(ZSim.SimGeneralPostNavigate.shape.res.parse("Navigation updated successfully."));
  });
}
