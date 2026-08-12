import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { triggerSessionEvent } from "@/adapters/realtime/server";

export async function handleGetSessionNav(playId: string, playerId: string, isHost?: boolean) {
  let currentTab = 0;
  let progress = 0;

  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: playId },
    select: { id: true, currentTab: true, config: true },
  });

  if (!liveSession) {
    return JSend.error("Live session not found.", 404);
  }

  const sessionConfig = (liveSession.config as any) ?? {};
  const isTutorLed = sessionConfig.controlMode === "tutor-led";

  if (isHost || isTutorLed || !playerId) {
    currentTab = liveSession.currentTab;
    progress = Math.round((currentTab / 5) * 100);
  } else {
    const player = await prisma.sessionPlayer.findUnique({
      where: { id: playerId },
      select: { id: true },
    });

    if (player) {
      const attempt = await prisma.playAttempt.findUnique({
        where: { sessionPlayerId: player.id },
        select: { currentTab: true, progress: true },
      });

      currentTab = attempt?.currentTab ?? 0;
      progress = attempt?.progress ?? Math.round((currentTab / 5) * 100);
    }
  }

  const resData = { currentTab, progress };
  return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse(resData));
}

export async function handlePostSessionNav(playId: string, playerId: string, nextTab: number, isHost?: boolean) {
  const progress = Math.round((nextTab / 5) * 100);

  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: playId },
    select: { id: true, moduleVersionId: true, config: true },
  });

  if (!liveSession) {
    return JSend.error("Live session not found.", 404);
  }

  const sessionConfig = (liveSession.config as any) ?? {};
  const isTutorLed = sessionConfig.controlMode === "tutor-led";

  if (isTutorLed) {
    if (!isHost) {
      return JSend.error("Only the host can navigate in tutor-led mode.", 403);
    }

    await prisma.liveSession.update({
      where: { id: liveSession.id },
      data: { currentTab: nextTab },
    });

    await triggerSessionEvent(liveSession.id, "tab:change", { currentTab: nextTab });
  } else {
    if (isHost || !playerId) {
      await prisma.liveSession.update({
        where: { id: liveSession.id },
        data: { currentTab: nextTab },
      });
    } else {
      const player = await prisma.sessionPlayer.findUnique({
        where: { id: playerId },
        select: { id: true, userId: true },
      });

      if (player) {
        if (nextTab === 0) {
          await prisma.playAttempt.deleteMany({
            where: { sessionPlayerId: player.id },
          });
        }

        const firstCheckpoint = await prisma.moduleCheckpoint.findFirst({
          where: { moduleVersionId: liveSession.moduleVersionId },
          orderBy: { orderIndex: "asc" },
          select: { id: true },
        });

        await prisma.playAttempt.upsert({
          where: { sessionPlayerId: player.id },
          update: { currentTab: nextTab, progress },
          create: {
            sessionPlayerId: player.id,
            sessionId: liveSession.id,
            moduleVersionId: liveSession.moduleVersionId,
            userId: player.userId,
            playMode: "session",
            currentTab: nextTab,
            progress,
            currentCheckpointId: firstCheckpoint?.id ?? null,
          },
        });
      }
    }
  }

  return JSend.success(ZSim.SimGeneralPostNavigate.shape.res.parse("Navigation updated successfully."));
}
