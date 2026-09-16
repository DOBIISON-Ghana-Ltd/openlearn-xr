import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";

const ZGetParams = ZSes.SesAnalyticsGetInfo.shape.params;
const ZGetRes = ZSes.SesAnalyticsGetInfo.shape.res;

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user) => {
  const { id } = ZGetParams.parse(await ctx.params);

  const session = await prisma.liveSession.findFirst({
    where: {
      id,
      hostId: user.id,
    },
    select: {
      moduleVersion: {
        select: {
          module: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    return JSend.error("Session not found", 404);
  }

  const parsed = ZGetRes.parse(session);
  return JSend.success(parsed);
});
