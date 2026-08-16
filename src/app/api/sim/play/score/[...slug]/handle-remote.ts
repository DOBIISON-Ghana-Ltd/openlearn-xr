import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export function handleGetRemoteScore(playId: string) {
  return secureApiRoute<{ slug: string[] }>(async (req, ctx, user) => {
    let score = 0;
    let moduleId: string | undefined = undefined;

    const moduleVersion = await prisma.moduleVersion.findUnique({
      where: { id: playId },
      select: { moduleId: true },
    });

    moduleId = moduleVersion?.moduleId;

    if (moduleId) {
      const completion = await prisma.moduleCompletion.findUnique({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId,
          },
        },
        select: { lastScore: true },
      });

      score = completion?.lastScore ?? 0;
    }

    const resData = { score };
    return JSend.success(ZSim.SimGeneralGetScore.shape.res.parse(resData));
  });
}
