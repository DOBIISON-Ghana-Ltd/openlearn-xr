import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { triggerSessionEvent } from "@/adapters/realtime/server";

export async function handleGetSessionNav(playId: string, playerId: string, isHost?: boolean) {
  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: playId },
    select: { id: true, currentTab: true, config: true, moduleVersionId: true },
  });

  if (!liveSession) {
    return JSend.error("Live session not found.", 404);
  }

  const sessionConfig = (liveSession.config as any) ?? {};
  const isTutorLed = sessionConfig.controlMode === "tutor-led";

  // 1. Ensure student always has a PlayAttempt initialized for checkpoint state & scoring
  let attempt: any = null;
  if (!isHost && playerId) {
    attempt = await prisma.playAttempt.findUnique({
      where: { sessionPlayerId: playerId },
    });

    if (!attempt) {
      const [firstSessionCheckpoint, totalCheckpoints] = await prisma.$transaction([
        prisma.sessionCheckpoint.findFirst({
          where: { sessionId: liveSession.id, isEnabled: true },
          include: { checkpoint: true },
          orderBy: { checkpoint: { orderIndex: "asc" } },
        }),
        prisma.sessionCheckpoint.count({
          where: { sessionId: liveSession.id, isEnabled: true },
        }),
      ]);

      attempt = await prisma.playAttempt.create({
        data: {
          sessionPlayerId: playerId,
          sessionId: liveSession.id,
          moduleVersionId: liveSession.moduleVersionId,
          playMode: "session",
          currentTab: 0,
          progress: 0,
          currentCheckpointIndex: 0,
          accumulatedPoints: 0,
          currentCheckpointId: firstSessionCheckpoint?.checkpointId ?? null,
          totalCheckpoints,
        },
      });
    }
  }

  // 2. In tutor-led mode or for host: the visible tab follows liveSession.currentTab
  if (isHost || isTutorLed) {
    const currentTab = liveSession.currentTab;
    const progress = Math.round((currentTab / 5) * 100);
    return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse({ currentTab, progress }));
  };

  if (!attempt) return JSend.error("Error occured", 500);

  // 3. Student-paced mode: student uses their own attempt's currentTab
  const resData = {
    currentTab: attempt.currentTab,
    progress: attempt.progress,
  };
  return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse(resData));
}

export async function handlePostSessionNav(playId: string, playerId: string, nextTab: number, isHost?: boolean) {
  const responseMsg = ZSim.SimGeneralPostNavigate.shape.res.parse("Navigation updated successfully.");
  const progress = Math.round((nextTab / 5) * 100);

  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: playId },
    select: { id: true, currentTab: true, config: true },
  });

  if (!liveSession) {
    return JSend.error("Live session not found.", 404);
  }

  const isTutorLed = ((liveSession.config as any) ?? {}).controlMode === "tutor-led";

  if (isTutorLed && !isHost) {
    return JSend.error("Only the host can navigate in tutor-led mode.", 403);
  }

  // 1. Host navigation (updates liveSession and notifies realtime if tutor-led)
  if (isHost) {
    await prisma.liveSession.update({
      where: { id: liveSession.id },
      data: { currentTab: nextTab },
    });

    if (isTutorLed) {
      await triggerSessionEvent(playId, "tab:change", { currentTab: nextTab });
    }

    return JSend.success(responseMsg);
  }

  // 2. Student navigation (student-paced mode: updates student's own playAttempt)
  await prisma.playAttempt.update({
    where: { sessionPlayerId: playerId },
    data: { currentTab: nextTab, progress },
  });

  return JSend.success(responseMsg);
}
