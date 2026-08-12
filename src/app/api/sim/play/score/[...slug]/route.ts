import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";
import { parsePlaySlug } from "@/lib/utils/parse-play-slug";

export const GET = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZSim.SimGeneralGetScore.shape.params.parse(parsePlaySlug(slug));
  const { mode, playId, playerId } = params;

  let score = 0;
  let moduleId: string | undefined = undefined;

  if (mode === "session") {
    if (!playerId) {
      return JSend.error("Player ID is required for session score", 400);
    }

    const player = await prisma.sessionPlayer.findUnique({
      where: { id: playerId },
      select: { score: true },
    });

    score = player?.score ?? 0;
  } else if (mode === "remote") {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession?.user) {
      return JSend.error("Unauthorized: Sign in required to fetch score", 401);
    }

    const moduleVersion = await prisma.moduleVersion.findUnique({
      where: { id: playId },
      select: { moduleId: true },
    });

    moduleId = moduleVersion?.moduleId;

    if (moduleId) {
      const completion = await prisma.moduleCompletion.findUnique({
        where: {
          userId_moduleId: {
            userId: userSession.user.id,
            moduleId,
          },
        },
        select: { lastScore: true },
      });

      score = completion?.lastScore ?? 0;
    }
  }

  const resData = { score, moduleId };
  return JSend.success(ZSim.SimGeneralGetScore.shape.res.parse(resData));
});
