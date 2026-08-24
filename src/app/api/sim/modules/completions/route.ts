import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

const ZGetRes = ZSim.SimModuleCompletionGetAll.shape.res;

export const GET = secureApiRoute(async (req, ctx, user) => {
  const completions = await prisma.moduleCompletion.findMany({
    where: { userId: user.id },
    include: {
      module: {
        include: {
          collection: true,
        },
      },
      lastPlayedVersion: true,
    },
    orderBy: {
      lastPlayedAt: "desc",
    },
  });

  const parsedData = ZGetRes.parse(completions);

  return JSend.success(parsedData);
});
