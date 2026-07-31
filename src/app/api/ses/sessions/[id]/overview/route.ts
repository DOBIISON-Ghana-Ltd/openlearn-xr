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
      id: true,
      name: true,
      status: true,
      joinCode: true,
      createdAt: true,
      moduleVersion: {
        select: {
          versionNumber: true,
          module: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!liveSession) {
    return JSend.error("Session not found.", 404);
  }

  const parsedData = ZSes.SesSessionGetOverview.shape.res.parse(liveSession);
  return JSend.success(parsedData);
});
