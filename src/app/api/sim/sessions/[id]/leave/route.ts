import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { triggerSessionEvent } from "@/adapters/realtime/server";

export const POST = apiHandler<{ id: string }>(async (req, ctx) => {
  const { id: playId } = await ctx.params;
  const body = ZSim.SimSessionPostLeave.shape.body.parse(await req.json());

  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: playId },
    select: { id: true },
  });

  if (!liveSession) {
    return JSend.error("Session not found", 404);
  }

  const player = await prisma.sessionPlayer.findUnique({
    where: { id: body.playerId },
    select: { id: true, name: true },
  });

  await prisma.sessionPlayer.deleteMany({
    where: {
      id: body.playerId,
      sessionId: liveSession.id,
    },
  });

  if (player) {
    await triggerSessionEvent(playId, "player:left", {
      participantId: player.id,
      name: player.name,
    });
  }

  return JSend.success("Left session successfully");
});
