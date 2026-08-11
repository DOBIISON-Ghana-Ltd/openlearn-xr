import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { playId } = ZSim.SimSessionGetStats.shape.params.parse({
    playId: params?.id,
  });

  const session = await prisma.liveSession.findFirst({
    where: { joinCode: playId },
    select: {
      status: true,
    },
  });

  if (!session) {
    return JSend.error("Session not found", 404);
  }

  const parsedData = ZSim.SimSessionGetStats.shape.res.parse(session);

  return JSend.success(parsedData);
});
