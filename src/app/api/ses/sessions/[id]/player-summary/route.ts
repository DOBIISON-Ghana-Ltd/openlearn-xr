import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user, session) => {
  const params = await ctx.params;
  const id = params?.id;

  if (!id) {
    return JSend.error("Session ID is required.", 400);
  }

  if (!session.activeOrganizationId) {
    return JSend.error(
      "No active organization found. Please switch to or create an organization.",
      404
    );
  }

  const players = await prisma.sessionPlayer.findMany({
    where: {
      sessionId: id,
      session: {
        organizationId: session.activeOrganizationId,
      },
    },
    orderBy: [
      {
        playAttempt: {
          accumulatedPoints: "desc",
        },
      },
      {
        joinedAt: "asc",
      },
    ],
    take: 10,
    select: {
      name: true,
      avatar: true,
      score: true,
      playAttempt: {
        select: {
          accumulatedPoints: true,
        },
      },
    },
  });

  const parsedData = ZSes.SesSessionGetPlayerSummary.shape.res.parse(players);
  return JSend.success(parsedData);
});
