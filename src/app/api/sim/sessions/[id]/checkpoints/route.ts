import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user, session) => {
  const { id: joinCode } = await ctx.params;

  if (!joinCode) {
    return JSend.error("Session join code is required.", 400);
  }

  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode },
    select: {
      id: true,
      hostId: true,
      organizationId: true,
    },
  });

  if (!liveSession) {
    return JSend.error("Live session not found.", 404);
  }

  if (liveSession.hostId !== user.id) {
    return JSend.error("Only the host can view session checkpoints.", 403);
  }

  if (liveSession.organizationId && session.activeOrganizationId && liveSession.organizationId !== session.activeOrganizationId) {
    return JSend.error("Unauthorized organization access.", 403);
  }

  const sessionCheckpoints = await prisma.sessionCheckpoint.findMany({
    where: {
      sessionId: liveSession.id,
      isEnabled: true,
    },
    select: {
      checkpoint: {
        select: {
          id: true,
          question: true,
          options: true,
          correctAnswer: true,
          explanation: true,
          hint: true,
          points: true,
          orderIndex: true,
        },
      },
    },
    orderBy: {
      checkpoint: {
        orderIndex: "asc",
      },
    },
  });

  const parsedData = ZSim.SimSessionGetCheckpoints.shape.res.parse(sessionCheckpoints);
  return JSend.success(parsedData);
});
