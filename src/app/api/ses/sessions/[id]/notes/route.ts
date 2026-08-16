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

  const liveSession = await prisma.liveSession.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    select: {
      moduleVersion: {
        select: {
          notes: true,
        },
      },
    },
  });

  if (!liveSession) {
    return JSend.error("Session not found.", 404);
  }

  const parsedData = ZSes.SesSessionGetNotes.shape.res.parse(liveSession.moduleVersion);
  return JSend.success(parsedData);
});
