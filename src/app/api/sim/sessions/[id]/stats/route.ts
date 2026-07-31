import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { id } = ZSim.SimSessionGetStats.shape.params.parse(params);

  const session = await prisma.liveSession.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      status: true,
      config: true,
    },
  });

  if (!session) {
    return JSend.error("Session not found", 404);
  }

  const parsedData = ZSim.SimSessionGetStats.shape.res.parse(session);

  return JSend.success(parsedData);
});
