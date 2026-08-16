import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";
import { joinCode } from "@/lib/utils/generate-join-code";

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error(
      "No active organization found. Please switch to or create an organization.",
      404
    );
  }

  const query = ZSes.SesSessionGetAll.shape.query.parse(
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

  const parsedData = ZSes.SesSessionGetAll.shape.res.parse(sessions);
  return JSend.success(parsedData);
});

export const POST = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error("No active organization found.", 404);
  }

  const rawBody = await req.json();
  const body = ZSes.SesSessionPostCreate.shape.body.parse(rawBody);

  if (!joinCode.check(body.joinCode)) {
    return JSend.error("Invalid join code format. Expected format: xxxx-xxxx-xxxx", 400);
  }

  await prisma.liveSession.create({
    data: {
      name: body.name,
      moduleVersionId: body.moduleId,
      hostId: user.id,
      organizationId: session.activeOrganizationId,
      joinCode: body.joinCode,
      status: "STAGING",
      config: body.config
    }
  });
  return JSend.success("Session created successfully");
});
