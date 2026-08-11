import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import prisma from "@/adapters/db/client";
import { triggerSessionEvent } from "@/adapters/realtime/server";

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

  const player = await prisma.sessionPlayer.create({
    data: {
      sessionId: liveSession.id,
      userId: null,
      name: body.name,
      avatar: body.avatar || "avatar-01",
    },
  });

  await triggerSessionEvent(liveSession.id, "player:joined", {
    participantId: player.id,
    name: player.name,
  });

  const parsedData = ZSim.SimSessionPostJoin.shape.res.parse({
    playerId: player.id,
    sessionId: liveSession.id,
    joinCode: liveSession.joinCode,
  });

  return JSend.success(parsedData);
});

