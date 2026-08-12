import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { id: playId } = ZSim.SimSessionGetPlayers.shape.params.parse(params);

  const players = await prisma.sessionPlayer.findMany({
    where: { session: { joinCode: playId } },
    select: {
      id: true,
      name: true,
      avatar: true,
      joinedAt: true,
      score: true,
      completedAt: true,
    },
    orderBy: { joinedAt: "asc" },
  });

  const parsedData = ZSim.SimSessionGetPlayers.shape.res.parse(players);

  return JSend.success(parsedData);
});
