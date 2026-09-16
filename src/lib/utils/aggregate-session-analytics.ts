import { Infer } from '@/data/types.base';

export type ISessionAnalytic = Infer["SesAnalyticsGetEngagement"]["res"][number];

export type ISessionTimelinePoint = {
  timeLabel: string;
  minute: number;
  interactions: number;
  activeStudents: number;
};

export const BUCKET_INTERVAL_MINUTES = 5;

/**
 * Aggregator utility that groups raw SessionAnalytic events into regular time buckets for charting.
 *
 * @param analytics - Array of session analytics events.
 * @param intervalMinutes - Size of each bucket window in minutes (defaults to 5).
 */
export default function aggregateSessionAnalytics(
  analytics: ISessionAnalytic[],
  intervalMinutes: number = BUCKET_INTERVAL_MINUTES
): ISessionTimelinePoint[] {
  if (!analytics || analytics.length === 0) return [];

  const sorted = [...analytics].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const firstTime = new Date(sorted[0].recordedAt).getTime();
  const lastTime = new Date(sorted[sorted.length - 1].recordedAt).getTime();
  const durationMinutes = Math.ceil((lastTime - firstTime) / (60 * 1000));
  const totalBuckets = Math.max(1, Math.ceil((durationMinutes + 1) / intervalMinutes));

  const points: ISessionTimelinePoint[] = [];

  for (let i = 0; i < totalBuckets; i++) {
    const minute = i * intervalMinutes;
    const bucketStartMs = firstTime + minute * 60 * 1000;
    const bucketEndMs = bucketStartMs + intervalMinutes * 60 * 1000;

    const bucketEvents = sorted.filter((item) => {
      const time = new Date(item.recordedAt).getTime();
      return time >= bucketStartMs && (i === totalBuckets - 1 ? time <= bucketEndMs : time < bucketEndMs);
    });

    const uniquePlayers = new Set(bucketEvents.map((item) => item.playerId));
    const hours = Math.floor(minute / 60);
    const mins = minute % 60;
    const timeLabel = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

    points.push({
      timeLabel,
      minute,
      interactions: bucketEvents.length,
      activeStudents: uniquePlayers.size,
    });
  }

  return points;
}
