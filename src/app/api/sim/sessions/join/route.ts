import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import prisma from "@/adapters/db/client";
import { triggerSessionEvent } from "@/adapters/realtime/server";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";

export const POST = apiHandler(async (req) => {
  const rawBody = await req.json();
  const body = ZSim.SimSessionPostJoin.shape.body.parse(rawBody);

  const liveSession = await prisma.liveSession.findFirst({
    where: { joinCode: body.joinCode },
  });

  if (!liveSession) {
    return JSend.error("Session not found.", 404);
  }

  if (liveSession.status === "COMPLETED" || liveSession.status === "CANCELLED") {
    return JSend.error("This session is no longer active.", 400);
  }

  const config = liveSession.config as { allowLateAdmissions?: boolean } | null;
  const allowLateAdmissions = config?.allowLateAdmissions ?? true;

  if (liveSession.status === "ACTIVE" && !allowLateAdmissions) {
    return JSend.error("Late admissions are not allowed for this active session.", 403);
  }

  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  const isHost = Boolean(userSession?.user && userSession.user.id === liveSession.hostId);

  let playerId: string | null = null;

  if (!isHost) {
    const player = await prisma.sessionPlayer.create({
      data: {
        sessionId: liveSession.id,
        userId: userSession?.user?.id || null,
        name: body.name,
        avatar: body.avatar || "avatar-01",
      },
    });

    playerId = player.id;

    await triggerSessionEvent(liveSession.id, "player:joined", {
      participantId: player.id,
      name: player.name,
    });
  }

  const parsedData = ZSim.SimSessionPostJoin.shape.res.parse({
    playerId,
    sessionId: liveSession.id,
    joinCode: liveSession.joinCode,
    isHost,
    config: liveSession.config,
  });

  return JSend.success(parsedData);
});
