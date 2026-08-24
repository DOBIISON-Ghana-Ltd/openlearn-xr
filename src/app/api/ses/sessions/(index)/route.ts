import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";
import { joinCode } from "@/lib/utils/generate-join-code";

const ZGetQuery = ZSes.SesSessionGetAll.shape.query;
const ZGetRes = ZSes.SesSessionGetAll.shape.res;

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error(
      "No active organization found. Please switch to or create an organization.",
      404
    );
  }

  const query = ZGetQuery.parse(
    { status: req.nextUrl.searchParams.getAll("status") }
  );

  const sessions = await prisma.liveSession.findMany({
    where: {
      hostId: user.id,
      organizationId: session.activeOrganizationId,
      ...(query?.status && query.status.length > 0 ? { status: { in: query.status } } : {}),
    },
    select: {
      id: true,
      name: true,
      status: true,
      joinCode: true,
      config: true,
      moduleVersion: {
        select: {
          module: {
            select: {
              title: true,
              image: true,
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
      players: {
        take: 2,
        orderBy: [
          { score: "desc" },
          { joinedAt: "desc" },
        ],
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedData = ZGetRes.parse(sessions);
  return JSend.success(parsedData);
});

const ZPostBody = ZSes.SesSessionPostCreate.shape.body;

export const POST = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error("No active organization found.", 404);
  }

  const rawBody = await req.json();
  const body = ZPostBody.parse(rawBody);

  if (!joinCode.check(body.joinCode)) {
    return JSend.error("Invalid join code format. Expected format: xxxx-xxxx-xxxx", 400);
  }

  await prisma.$transaction(async (tx) => {
    const moduleCheckpoints = await tx.moduleCheckpoint.findMany({
      where: { moduleVersionId: body.moduleId },
      select: { id: true },
    });

    const newSession = await tx.liveSession.create({
      data: {
        name: body.name,
        moduleVersionId: body.moduleId,
        hostId: user.id,
        organizationId: session.activeOrganizationId,
        joinCode: body.joinCode,
        status: "STAGING",
        config: body.config,
      },
    });

    if (moduleCheckpoints.length > 0) {
      await tx.sessionCheckpoint.createMany({
        data: moduleCheckpoints.map((checkpoint) => ({
          sessionId: newSession.id,
          checkpointId: checkpoint.id,
          isEnabled: true,
        })),
      });
    }
  });

  return JSend.success("Session created successfully");
});
