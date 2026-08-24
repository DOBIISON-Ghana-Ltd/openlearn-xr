import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";

const ZGetRes = ZSes.SesSessionGetRecent.shape.res;

export const GET = secureApiRoute(async (req, ctx, user) => {
  const sessions = await prisma.liveSession.findMany({
    where: {
      hostId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      name: true,
      status: true,
      config: true,
      joinCode: true,
      moduleVersion: {
        select: {
          module: {
            select: {
              title: true,
              collection: {
                select: {
                  name: true,
                  grade: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          players: true,
        },
      },
    },
  });

  const parsed = ZGetRes.parse(sessions);
  return JSend.success(parsed);
});
