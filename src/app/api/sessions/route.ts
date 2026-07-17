import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSession from "@/data/api/session/session.schema";
import { hasSessionAccess } from "@/lib/utils/suite-access";
import { generateJoinCode } from "@/lib/utils/generate-join-code";
import { dummySessions } from "@/lib/constants/dummy-sessions";

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  // 1. If no active organization, return API error
  if (!session.activeOrganizationId) {
    return JSend.error("No active organization found. Please switch to or create an organization.", 404);
  }

  // 2. Fetch the active organization and its active subscription (Commented out for mock testing)
  /*
  const org = await prisma.organization.findUnique({
    where: { id: session.activeOrganizationId },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 1
      },
    },
  });

  if (!org) {
    return JSend.error("Active organization not found.", 404);
  }

  // 3. Verify session room feature access
  const tier = org.subscriptions[0]?.tier || "FREE";
  const isUnlimited = org.subscriptions[0]?.isUnlimited || false;

  if (!hasSessionAccess(tier, isUnlimited)) {
    return JSend.error("Your organization does not have access to session features. Please upgrade your plan.", 403);
  }

  // 4. Fetch all sessions in the organization
  const sessions = await prisma.liveSession.findMany({
    where: { organizationId: session.activeOrganizationId },
    include: {
      host: true,
      moduleVersion: {
        include: {
          module: {
            include: {
              collection: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  */

  const parsedData = ZSession.PublicSessionGetAll.shape.res.parse(dummySessions);

  return JSend.success(parsedData);
});

export const POST = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error("No active organization found.", 404);
  }

  const rawBody = await req.json();
  const body = ZSession.PublicSessionCreate.shape.body.parse(rawBody);

  /*
  const created = await prisma.liveSession.create({
    data: {
      name: body.name,
      moduleVersionId: body.moduleVersionId,
      hostId: user.id,
      organizationId: session.activeOrganizationId,
      joinCode: generateJoinCode(),
    },
    select: { id: true },
  });
  */

  // Generate a random mock ID for testing
  const mockId = `session-${Math.random().toString(36).substring(2, 9)}`;
  const mockCreated = { id: mockId };

  const parsedData = ZSession.PublicSessionCreate.shape.res.parse(mockCreated);
  return JSend.success(parsedData);
});

