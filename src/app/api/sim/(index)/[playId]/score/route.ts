import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";

export const GET = apiHandler<{ playId: string }>(async (req, ctx) => {
  const params = ZSim.SimGeneralGetScore.shape.params.parse(await ctx.params);
  const searchParams = ZSim.SimGeneralGetScore.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const { playId } = params;
  const { mode, playerId } = searchParams;

  let score = 0;
  let moduleId: string | undefined = undefined;

  if (mode === "session") {
    if (!playerId) {
      return JSend.error("Player ID is required for session mode", 400);
    }

    const player = await prisma.sessionPlayer.findFirst({
      where: {
        sessionId: playId,
        id: playerId,
      },
      select: { score: true },
    });
    score = player?.score ?? 0;
  } else if (mode === "module:local" || mode === "module:remote") {
    const moduleVersion = await prisma.moduleVersion.findUnique({
      where: { id: playId },
      select: { moduleId: true },
    });

    moduleId = moduleVersion?.moduleId;

    if (mode === "module:remote") {
      const userSession = await auth.api.getSession({
        headers: await headers(),
      });

      if (!userSession?.user) {
        return JSend.error("Unauthorized: Sign in required to fetch score", 401);
      }

      if (moduleId) {
        const completion = await prisma.moduleCompletion.findFirst({
          where: {
            userId: userSession.user.id,
            moduleId,
          },
          select: { lastScore: true },
        });
        score = completion?.lastScore ?? 0;
      }
    }
  }

  const resData = { score, moduleId };
  return JSend.success(ZSim.SimGeneralGetScore.shape.res.parse(resData));
});
