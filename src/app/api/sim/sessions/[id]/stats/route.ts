import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { auth } from "@/adapters/auth/server";
import { headers } from "next/headers";

const ZGetParams = ZSim.SimSessionGetStats.shape.params;
const ZGetRes = ZSim.SimSessionGetStats.shape.res;

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const { id } = ZGetParams.parse(await ctx.params);

  const session = await prisma.liveSession.findUnique({
    where: { joinCode: id },
    select: {
      id: true,
      status: true,
      config: true,
      hostId: true,
    },
  });

  if (!session) {
    return JSend.error("Session not found", 404);
  }

  const userSession = await auth.api.getSession({
    headers: await headers(),
  });
  const isHost = Boolean(userSession?.user && userSession.user.id === session.hostId);

  const parsedData = ZGetRes.parse({
    status: session.status,
    config: session.config,
    sessionId: session.id,
    isHost,
  });

  return JSend.success(parsedData);
});
