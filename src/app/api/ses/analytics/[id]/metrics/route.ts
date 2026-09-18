import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";
import { ZSessionConfig } from "@/data/schema.base";

const ZGetParams = ZSes.SesAnalyticsGetMetrics.shape.params;
const ZGetRes = ZSes.SesAnalyticsGetMetrics.shape.res;

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user) => {
  const { id } = ZGetParams.parse(await ctx.params);

  const session = await prisma.liveSession.findFirst({
    where: {
      id,
      hostId: user.id,
    },
    select: {
      config: true,
      players: {
        select: {
          playAttempt: {
            select: {
              accumulatedPoints: true,
              totalCheckpointPoints: true,
              preAssessmentEarnedPoints: true,
              preAssessmentTotalPoints: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    return JSend.error("Session not found", 404);
  }

  const config = ZSessionConfig.parse(session.config);
  const maxPlayers = config.maxAdmissions || 25;
  const totalPlayers = session.players.length;
  const attendanceScore = `${totalPlayers} / ${maxPlayers}`;
  const attendanceAverage = maxPlayers > 0 ? Math.round((totalPlayers / maxPlayers) * 100) : 0;

  let preSum = 0;
  let preCount = 0;
  let postSum = 0;
  let postCount = 0;

  let improvedCount = 0;
  let noChangeCount = 0;
  let declinedCount = 0;
  let totalAssessedCount = 0;

  session.players.forEach((p) => {
    const attempt = p.playAttempt;
    if (!attempt) return;

    let studentPrePct: number | null = null;
    let studentPostPct: number | null = null;

    // 1. Pre-Assessment calculation
    const preTotal = attempt.preAssessmentTotalPoints ?? 0;
    const preEarned = attempt.preAssessmentEarnedPoints ?? 0;
    if (preTotal > 0) {
      const pct = (preEarned / preTotal) * 100;
      preSum += pct;
      preCount++;
      studentPrePct = Math.round(pct);
    }

    // 2. Post-Assessment calculation
    const postTotal = attempt.totalCheckpointPoints ?? 0;
    const postEarned = attempt.accumulatedPoints ?? 0;
    if (postTotal > 0) {
      const pct = (postEarned / postTotal) * 100;
      postSum += pct;
      postCount++;
      studentPostPct = Math.round(pct);
    }

    // 3. Glance breakdown per student with both assessments
    if (studentPrePct !== null && studentPostPct !== null) {
      totalAssessedCount++;
      const delta = studentPostPct - studentPrePct;
      if (delta > 0) {
        improvedCount++;
      } else if (delta < 0) {
        declinedCount++;
      } else {
        noChangeCount++;
      }
    }
  });

  const preTestAverage = preCount > 0 ? Math.round(preSum / preCount) : 0;
  const postTestAverage = postCount > 0 ? Math.round(postSum / postCount) : 0;
  const rawScoreDifference = postTestAverage - preTestAverage;
  const scoreDifference = rawScoreDifference > 0 ? `+${rawScoreDifference}pts` : `${rawScoreDifference}pts`;

  const improvedPercent = totalAssessedCount > 0 ? Math.round((improvedCount / totalAssessedCount) * 100) : 0;
  const noChangePercent = totalAssessedCount > 0 ? Math.round((noChangeCount / totalAssessedCount) * 100) : 0;
  const declinedPercent = totalAssessedCount > 0 ? Math.round((declinedCount / totalAssessedCount) * 100) : 0;

  const parsed = ZGetRes.parse({
    attendanceScore,
    attendanceAverage,
    preTestAverage,
    postTestAverage,
    scoreDifference,
    rawScoreDifference,
    improvedCount,
    improvedPercent,
    noChangeCount,
    noChangePercent,
    declinedCount,
    declinedPercent,
    totalAssessedCount,
  });
  return JSend.success(parsed);
});
