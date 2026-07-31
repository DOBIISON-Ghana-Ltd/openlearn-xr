import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { triggerSessionEvent } from "@/adapters/realtime/server";

export const POST = apiHandler<{ id: string }>(async (req, ctx) => {
  const { id: sessionId } = await ctx.params;
  const body = ZSim.SimSessionPostLeave.shape.body.parse(await req.json());

  const player = await prisma.sessionPlayer.findUnique({
    where: { id: body.playerId },
    select: { id: true, name: true },
  });

  await prisma.sessionPlayer.deleteMany({
    where: {
      id: body.playerId,
      sessionId,
    },
  });

  if (player) {
    await triggerSessionEvent(sessionId, "player:left", {
      participantId: player.id,
      name: player.name,
    });
  }

  return JSend.success("Left session successfully");
});
