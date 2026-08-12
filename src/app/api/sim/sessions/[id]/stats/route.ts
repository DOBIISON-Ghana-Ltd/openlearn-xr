import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const { id } = ZSim.SimSessionGetStats.shape.params.parse(await ctx.params);

  const session = await prisma.liveSession.findUnique({
    where: { joinCode: id },
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
