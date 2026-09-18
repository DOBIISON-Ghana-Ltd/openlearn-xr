import { Infer } from '@/data/types.base';

export type IPlayers = Infer["SimSessionGetPlayers"]["res"];

export type ISessionMetrics = {
  attendanceScore: string;
  attendanceAverage: number;
  preTestAverage: number;
  postTestAverage: number;
  scoreDifference: string;
  rawScoreDifference: number;
  improvedCount: number;
  improvedPercent: number;
  noChangeCount: number;
  noChangePercent: number;
  declinedCount: number;
  declinedPercent: number;
  totalAssessedCount: number;
};

/**
 * Calculates attendance, pre-assessment, post-assessment, and score delta metrics for a live session.
 *
 * @param players - Array of session players containing playAttempt details.
 * @param maxPlayers - Configured maximum admissions limit for the session.
 */
export default function calculateSessionMetrics(players: IPlayers, maxPlayers: number = 25): ISessionMetrics {
  const totalPlayers = players.length;
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

  players.forEach((p) => {
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

  return {
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
  };
}
