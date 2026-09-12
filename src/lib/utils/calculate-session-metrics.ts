import { Infer } from '@/data/types.base';

export type IPlayers = Infer["SimSessionGetPlayers"]["res"];

export type ISessionMetrics = {
  attendanceScore: string;
  attendanceAverage: number;
  preTestAverage: number;
  postTestAverage: number;
  scoreDifference: string;
  rawScoreDifference: number;
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
  const attendanceAverage = Math.round((totalPlayers / maxPlayers) * 100);

  let preSum = 0;
  let preCount = 0;
  let postSum = 0;
  let postCount = 0;

  players.forEach((p) => {
    const attempt = p.playAttempt;
    if (!attempt) return;

    // 1. Pre-Assessment calculation
    const preTotal = attempt.preAssessmentTotalPoints ?? 0;
    const preEarned = attempt.preAssessmentEarnedPoints ?? 0;
    if (preTotal > 0) {
      preSum += (preEarned / preTotal) * 100;
      preCount++;
    }

    // 2. Post-Assessment calculation
    const postTotal = attempt.totalCheckpointPoints ?? 0;
    const postEarned = attempt.accumulatedPoints ?? 0;
    if (postTotal > 0) {
      postSum += (postEarned / postTotal) * 100;
      postCount++;
    }
  });

  const preTestAverage = preCount > 0 ? Math.round(preSum / preCount) : 0;
  const postTestAverage = postCount > 0 ? Math.round(postSum / postCount) : 0;
  const rawScoreDifference = postTestAverage - preTestAverage;
  const scoreDifference = rawScoreDifference > 0 ? `+${rawScoreDifference}pts` : `${rawScoreDifference}pts`;

  return {
    attendanceScore,
    attendanceAverage,
    preTestAverage,
    postTestAverage,
    scoreDifference,
    rawScoreDifference,
  };
}
