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

  const participants = await prisma.sessionPlayer.findMany({
    where: {
      sessionId: id,
      session: {
        organizationId: session.activeOrganizationId,
      },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      user: {
        select: {
          image: true,
        },
      },
    },
  });

  const parsedData = ZSes.SesSessionGetParticipants.shape.res.parse(participants);
  return JSend.success(parsedData);
});
