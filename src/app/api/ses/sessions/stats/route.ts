import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";

const ZGetRes = ZSes.SesSessionGetStats.shape.res;

/**
 * Calculates the start of the current week (Monday at 00:00:00.000 UTC).
 */
function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0, 0));
}

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  const startOfWeek = getStartOfWeek();

  const sessionWhere = {
    hostId: user.id,
    ...(session.activeOrganizationId ? { organizationId: session.activeOrganizationId } : {}),
  };

  const [sessionsThisWeek, studentsEngaged, engagementAggregate] = await Promise.all([
    prisma.liveSession.count({
      where: {
        ...sessionWhere,
        createdAt: { gte: startOfWeek },
      },
    }),
    prisma.sessionPlayer.count({
      where: {
        session: {
          ...sessionWhere,
          createdAt: { gte: startOfWeek },
        },
      },
    }),
    prisma.playAttempt.aggregate({
      where: {
        session: {
          ...sessionWhere,
          createdAt: { gte: startOfWeek },
        },
      },
      _avg: {
        progress: true,
      },
    }),
  ]);

  const payload = ZGetRes.parse([
    {
      label: "Sessions This Week",
      value: String(sessionsThisWeek),
    },
    {
      label: "Students Engaged",
      value: String(studentsEngaged),
    },
    {
      label: "Avg. Engagement",
      value: `${Math.round(engagementAggregate._avg.progress ?? 0)}%`,
    },
  ]);
  return JSend.success(payload);
});
