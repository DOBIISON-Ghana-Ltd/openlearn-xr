import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";
import { generateJoinCode } from "@/lib/utils/generate-join-code";

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error(
      "No active organization found. Please switch to or create an organization.",
      404
    );
  }

  const sessions = await prisma.liveSession.findMany({
    where: {
      organizationId: session.activeOrganizationId,
    },
    select: {
      id: true,
      name: true,
      status: true,
      startedAt: true,
      endedAt: true,
      host: {
        select: {
          name: true,
          image: true,
        },
      },
      moduleVersion: {
        select: {
          versionNumber: true,
          module: {
            select: {
              title: true,
              collection: {
                select: {
                  name: true,
                  level: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedData = ZSes.SesSessionGetAll.shape.res.parse(sessions);
  return JSend.success(parsedData);
});

export const POST = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error("No active organization found.", 404);
  }

  const rawBody = await req.json();
  const body = ZSes.SesSessionPostCreate.shape.body.parse(rawBody);

  const joinCode = generateJoinCode();

  const createdSession = await prisma.liveSession.create({
    data: {
      name: body.name,
      moduleVersionId: body.moduleVersionId,
      hostId: user.id,
      organizationId: session.activeOrganizationId,
      joinCode,
      status: "STAGING",
    },
    select: {
      id: true,
    },
  });

  const parsedData = ZSes.SesSessionPostCreate.shape.res.parse(createdSession);
  return JSend.success(parsedData);
});
