import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";
import { triggerSessionEvent } from "@/adapters/realtime/server";
import { parsePlaySlug } from "@/lib/utils/parse-play-slug";

export const GET = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZSim.SimGeneralGetNavigate.shape.params.parse(parsePlaySlug(slug));
  const searchParams = ZSim.SimGeneralGetNavigate.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const { mode, playId, playerId } = params;
  const { isHost } = searchParams;

  let currentTab = 0;
  let progress = 0;

  if (mode === "session") {
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
  } else if (mode === "remote") {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession?.user) {
      return JSend.error("Unauthorized", 401);
    }

    const attempt = await prisma.playAttempt.findFirst({
      where: {
        moduleVersionId: playId,
        userId: userSession.user.id,
      },
      select: { currentTab: true, progress: true },
    });

    currentTab = attempt?.currentTab ?? 0;
    progress = attempt?.progress ?? Math.round((currentTab / 5) * 100);
  }

  const resData = { currentTab, progress };
  return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse(resData));
});

export const POST = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZSim.SimGeneralPostNavigate.shape.params.parse(parsePlaySlug(slug));

  const rawBody = await req.json();
  const { nextTab } = ZSim.SimGeneralPostNavigate.shape.body.parse(rawBody);

  const searchParams = ZSim.SimGeneralPostNavigate.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  const { mode, playId, playerId } = params;
  const { isHost } = searchParams;
  const progress = Math.round((nextTab / 5) * 100);

  if (mode === "session") {
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
            },
          });
        }
      }
    }
  } else if (mode === "remote") {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession?.user) {
      return JSend.error("Unauthorized", 401);
    }

    const attempt = await prisma.playAttempt.findFirst({
      where: {
        moduleVersionId: playId,
        userId: userSession.user.id,
      },
    });

    if (attempt) {
      await prisma.playAttempt.update({
        where: { id: attempt.id },
        data: { currentTab: nextTab, progress },
      });
    } else {
      await prisma.playAttempt.create({
        data: {
          userId: userSession.user.id,
          moduleVersionId: playId,
          playMode: "library",
          currentTab: nextTab,
          progress,
        },
      });
    }
  }

  return JSend.success(ZSim.SimGeneralPostNavigate.shape.res.parse("Navigation updated successfully."));
});
