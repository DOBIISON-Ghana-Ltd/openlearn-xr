'use client';

import { useMemo } from 'react';
import useApi from '@/data/hooks/use-api';
import { AxisOptions, Chart } from 'react-charts';
import aggregateSessionAnalytics, {
  ISessionAnalytic,
  ISessionTimelinePoint,
} from '@/lib/utils/aggregate-session-analytics';

export type { ISessionAnalytic, ISessionTimelinePoint };

export type IEngagementCard = {
  id: string;
};

type UserEngagementSeries = {
  label: string;
  data: ISessionTimelinePoint[];
};

// Explicit dummy session analytics events strictly matching ZSessionAnalytic type
export const DUMMY_SESSION_ANALYTICS: ISessionAnalytic[] = [
  // 00:00 - 05:00 (Session Join & Welcome Phase)
  { id: "ea-001", sessionId: "ses-1", playerId: "player-01", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:00:12Z" },
  { id: "ea-002", sessionId: "ses-1", playerId: "player-02", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:00:34Z" },
  { id: "ea-003", sessionId: "ses-1", playerId: "player-03", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:01:05Z" },
  { id: "ea-004", sessionId: "ses-1", playerId: "player-04", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:01:42Z" },
  { id: "ea-005", sessionId: "ses-1", playerId: "player-05", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:02:18Z" },
  { id: "ea-006", sessionId: "ses-1", playerId: "player-06", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:02:55Z" },
  { id: "ea-007", sessionId: "ses-1", playerId: "player-07", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:03:20Z" },
  { id: "ea-008", sessionId: "ses-1", playerId: "player-08", event: "tab:changed", payload: { tabIndex: 0 }, recordedAt: "2026-09-16T10:04:10Z" },

  // 05:00 - 10:00 (Pre-Assessment Phase)
  { id: "ea-009", sessionId: "ses-1", playerId: "player-01", event: "tab:changed", payload: { tabIndex: 1 }, recordedAt: "2026-09-16T10:05:02Z" },
  { id: "ea-010", sessionId: "ses-1", playerId: "player-02", event: "tab:changed", payload: { tabIndex: 1 }, recordedAt: "2026-09-16T10:05:15Z" },
  { id: "ea-011", sessionId: "ses-1", playerId: "player-03", event: "tab:changed", payload: { tabIndex: 1 }, recordedAt: "2026-09-16T10:05:30Z" },
  { id: "ea-012", sessionId: "ses-1", playerId: "player-04", event: "tab:changed", payload: { tabIndex: 1 }, recordedAt: "2026-09-16T10:05:45Z" },
  { id: "ea-013", sessionId: "ses-1", playerId: "player-01", event: "pre-test:changed", payload: { questionIndex: 0, selectedIndex: 2, isCorrect: true }, recordedAt: "2026-09-16T10:06:12Z" },
  { id: "ea-014", sessionId: "ses-1", playerId: "player-02", event: "pre-test:changed", payload: { questionIndex: 0, selectedIndex: 1, isCorrect: false }, recordedAt: "2026-09-16T10:06:28Z" },
  { id: "ea-015", sessionId: "ses-1", playerId: "player-03", event: "pre-test:changed", payload: { questionIndex: 0, selectedIndex: 2, isCorrect: true }, recordedAt: "2026-09-16T10:06:50Z" },
  { id: "ea-016", sessionId: "ses-1", playerId: "player-05", event: "pre-test:changed", payload: { questionIndex: 0, selectedIndex: 2, isCorrect: true }, recordedAt: "2026-09-16T10:07:15Z" },
  { id: "ea-017", sessionId: "ses-1", playerId: "player-01", event: "pre-test:changed", payload: { questionIndex: 1, selectedIndex: 0, isCorrect: true }, recordedAt: "2026-09-16T10:08:05Z" },
  { id: "ea-018", sessionId: "ses-1", playerId: "player-02", event: "pre-test:changed", payload: { questionIndex: 1, selectedIndex: 0, isCorrect: true }, recordedAt: "2026-09-16T10:08:30Z" },
  { id: "ea-019", sessionId: "ses-1", playerId: "player-04", event: "pre-test:changed", payload: { questionIndex: 1, selectedIndex: 3, isCorrect: false }, recordedAt: "2026-09-16T10:09:12Z" },
  { id: "ea-020", sessionId: "ses-1", playerId: "player-01", event: "pre-test:changed", payload: { questionIndex: 1, selectedIndex: 0, isCorrect: true }, recordedAt: "2026-09-16T10:09:55Z" },

  // 10:00 - 15:00 (Transition to 3D Simulation & Exploration)
  { id: "ea-021", sessionId: "ses-1", playerId: "player-01", event: "tab:changed", payload: { tabIndex: 2 }, recordedAt: "2026-09-16T10:10:08Z" },
  { id: "ea-022", sessionId: "ses-1", playerId: "player-02", event: "tab:changed", payload: { tabIndex: 2 }, recordedAt: "2026-09-16T10:10:22Z" },
  { id: "ea-023", sessionId: "ses-1", playerId: "player-03", event: "tab:changed", payload: { tabIndex: 2 }, recordedAt: "2026-09-16T10:10:45Z" },
  { id: "ea-024", sessionId: "ses-1", playerId: "player-01", event: "control:changed", payload: { controlKey: "rotation", controlValue: 45 }, recordedAt: "2026-09-16T10:11:15Z" },
  { id: "ea-025", sessionId: "ses-1", playerId: "player-02", event: "control:changed", payload: { controlKey: "zoom", controlValue: 1.5 }, recordedAt: "2026-09-16T10:11:40Z" },
  { id: "ea-026", sessionId: "ses-1", playerId: "player-03", event: "control:changed", payload: { controlKey: "tool", controlValue: "nucleus" }, recordedAt: "2026-09-16T10:12:10Z" },
  { id: "ea-027", sessionId: "ses-1", playerId: "player-04", event: "control:changed", payload: { controlKey: "tool", controlValue: "beaker" }, recordedAt: "2026-09-16T10:12:45Z" },
  { id: "ea-028", sessionId: "ses-1", playerId: "player-05", event: "control:changed", payload: { controlKey: "tool", controlValue: "burner" }, recordedAt: "2026-09-16T10:13:20Z" },
  { id: "ea-029", sessionId: "ses-1", playerId: "player-01", event: "control:changed", payload: { controlKey: "step", controlValue: 1 }, recordedAt: "2026-09-16T10:14:15Z" },
  { id: "ea-030", sessionId: "ses-1", playerId: "player-02", event: "control:changed", payload: { controlKey: "step", controlValue: 1 }, recordedAt: "2026-09-16T10:14:50Z" },

  // 15:00 - 20:00 (Peak Activity: High 3D Experimentation)
  { id: "ea-031", sessionId: "ses-1", playerId: "player-01", event: "control:changed", payload: { controlKey: "pipette", controlValue: 10 }, recordedAt: "2026-09-16T10:15:05Z" },
  { id: "ea-032", sessionId: "ses-1", playerId: "player-02", event: "control:changed", payload: { controlKey: "pipette", controlValue: 10 }, recordedAt: "2026-09-16T10:15:20Z" },
  { id: "ea-033", sessionId: "ses-1", playerId: "player-03", event: "control:changed", payload: { controlKey: "acid", controlValue: 5 }, recordedAt: "2026-09-16T10:15:45Z" },
  { id: "ea-034", sessionId: "ses-1", playerId: "player-04", event: "control:changed", payload: { controlKey: "temp", controlValue: 85 }, recordedAt: "2026-09-16T10:16:15Z" },
  { id: "ea-035", sessionId: "ses-1", playerId: "player-05", event: "control:changed", payload: { controlKey: "thermometer", controlValue: true }, recordedAt: "2026-09-16T10:16:40Z" },
  { id: "ea-036", sessionId: "ses-1", playerId: "player-06", event: "control:changed", payload: { controlKey: "rotation", controlValue: 90 }, recordedAt: "2026-09-16T10:17:10Z" },
  { id: "ea-037", sessionId: "ses-1", playerId: "player-07", event: "control:changed", payload: { controlKey: "step", controlValue: 2 }, recordedAt: "2026-09-16T10:17:45Z" },
  { id: "ea-038", sessionId: "ses-1", playerId: "player-01", event: "control:changed", payload: { controlKey: "step", controlValue: 2 }, recordedAt: "2026-09-16T10:18:20Z" },
  { id: "ea-039", sessionId: "ses-1", playerId: "player-02", event: "control:changed", payload: { controlKey: "step", controlValue: 2 }, recordedAt: "2026-09-16T10:18:55Z" },
  { id: "ea-040", sessionId: "ses-1", playerId: "player-03", event: "control:changed", payload: { controlKey: "step", controlValue: 2 }, recordedAt: "2026-09-16T10:19:30Z" },

  // 20:00 - 25:00 (Checkpoints / Post-test Evaluation Phase)
  { id: "ea-041", sessionId: "ses-1", playerId: "player-01", event: "tab:changed", payload: { tabIndex: 3 }, recordedAt: "2026-09-16T10:20:10Z" },
  { id: "ea-042", sessionId: "ses-1", playerId: "player-02", event: "tab:changed", payload: { tabIndex: 3 }, recordedAt: "2026-09-16T10:20:35Z" },
  { id: "ea-043", sessionId: "ses-1", playerId: "player-03", event: "tab:changed", payload: { tabIndex: 3 }, recordedAt: "2026-09-16T10:21:05Z" },
  { id: "ea-044", sessionId: "ses-1", playerId: "player-01", event: "post-test:changed", payload: { checkpointId: "cp-01", selectedIndex: 0 }, recordedAt: "2026-09-16T10:21:40Z" },
  { id: "ea-045", sessionId: "ses-1", playerId: "player-02", event: "post-test:changed", payload: { checkpointId: "cp-01", selectedIndex: 0 }, recordedAt: "2026-09-16T10:22:15Z" },
  { id: "ea-046", sessionId: "ses-1", playerId: "player-04", event: "control:changed", payload: { controlKey: "hint", controlValue: 1 }, recordedAt: "2026-09-16T10:23:05Z" },
  { id: "ea-047", sessionId: "ses-1", playerId: "player-01", event: "post-test:changed", payload: { checkpointId: "cp-01", isCorrect: true }, recordedAt: "2026-09-16T10:23:45Z" },
  { id: "ea-048", sessionId: "ses-1", playerId: "player-02", event: "post-test:changed", payload: { checkpointId: "cp-01", isCorrect: true }, recordedAt: "2026-09-16T10:24:20Z" },

  // 25:00 - 30:00 (Major Peak: Challenging Checkpoints Submissions)
  { id: "ea-049", sessionId: "ses-1", playerId: "player-01", event: "post-test:changed", payload: { checkpointId: "cp-02", selectedIndex: 1 }, recordedAt: "2026-09-16T10:25:05Z" },
  { id: "ea-050", sessionId: "ses-1", playerId: "player-02", event: "post-test:changed", payload: { checkpointId: "cp-02", selectedIndex: 1 }, recordedAt: "2026-09-16T10:25:25Z" },
  { id: "ea-051", sessionId: "ses-1", playerId: "player-03", event: "post-test:changed", payload: { checkpointId: "cp-01", isCorrect: true }, recordedAt: "2026-09-16T10:25:50Z" },
  { id: "ea-052", sessionId: "ses-1", playerId: "player-05", event: "control:changed", payload: { controlKey: "hint", controlValue: 1 }, recordedAt: "2026-09-16T10:26:15Z" },
  { id: "ea-053", sessionId: "ses-1", playerId: "player-06", event: "post-test:changed", payload: { checkpointId: "cp-01", isCorrect: false }, recordedAt: "2026-09-16T10:26:45Z" },
  { id: "ea-054", sessionId: "ses-1", playerId: "player-01", event: "post-test:changed", payload: { checkpointId: "cp-02", isCorrect: true }, recordedAt: "2026-09-16T10:27:20Z" },
  { id: "ea-055", sessionId: "ses-1", playerId: "player-02", event: "post-test:changed", payload: { checkpointId: "cp-02", isCorrect: true }, recordedAt: "2026-09-16T10:28:05Z" },
  { id: "ea-056", sessionId: "ses-1", playerId: "player-03", event: "post-test:changed", payload: { checkpointId: "cp-02", isCorrect: true }, recordedAt: "2026-09-16T10:28:50Z" },
  { id: "ea-057", sessionId: "ses-1", playerId: "player-04", event: "post-test:changed", payload: { checkpointId: "cp-02", isCorrect: false }, recordedAt: "2026-09-16T10:29:30Z" },

  // 30:00 - 35:00 (Wrap Up & Results Phase)
  { id: "ea-058", sessionId: "ses-1", playerId: "player-01", event: "tab:changed", payload: { tabIndex: 4 }, recordedAt: "2026-09-16T10:30:15Z" },
  { id: "ea-059", sessionId: "ses-1", playerId: "player-02", event: "tab:changed", payload: { tabIndex: 4 }, recordedAt: "2026-09-16T10:30:45Z" },
  { id: "ea-060", sessionId: "ses-1", playerId: "player-03", event: "tab:changed", payload: { tabIndex: 4 }, recordedAt: "2026-09-16T10:31:20Z" },
  { id: "ea-061", sessionId: "ses-1", playerId: "player-01", event: "control:changed", payload: { controlKey: "summary_view", controlValue: true }, recordedAt: "2026-09-16T10:32:05Z" },
  { id: "ea-062", sessionId: "ses-1", playerId: "player-02", event: "control:changed", payload: { controlKey: "summary_view", controlValue: true }, recordedAt: "2026-09-16T10:33:10Z" },
  { id: "ea-063", sessionId: "ses-1", playerId: "player-01", event: "control:changed", payload: { controlKey: "complete", controlValue: true }, recordedAt: "2026-09-16T10:34:45Z" },
  { id: "ea-064", sessionId: "ses-1", playerId: "player-02", event: "control:changed", payload: { controlKey: "complete", controlValue: true }, recordedAt: "2026-09-16T10:35:00Z" },
];

export default function EngagementCard(props: IEngagementCard) {
  const { id } = props;
  const { data } = useApi.query("ses:analytics:get:engagement", { id });

  const timelineData = useMemo(
    () => aggregateSessionAnalytics(data && data.length > 0 ? data : DUMMY_SESSION_ANALYTICS),
    [data]
  );

  const seriesData: UserEngagementSeries[] = useMemo(
    () => [
      {
        label: 'Interactions',
        data: timelineData,
      },
    ],
    [timelineData]
  );

  const primaryAxis = useMemo(
    (): AxisOptions<ISessionTimelinePoint> => ({
      getValue: (datum) => datum.timeLabel,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<ISessionTimelinePoint>[] => [
      {
        getValue: (datum) => datum.interactions,
        elementType: 'area',
      },
    ],
    []
  );

  return (
    <div className="col-span-12 lg:col-span-8 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-h6 sm:text-h5 font-bold text-secondary-text">
            Session Activity & Peaks
          </h2>
          <p className="text-small text-tertiary mt-0.5">
            Total interactions and active participation across lesson milestones.
          </p>
        </div>
      </div>

      {/* React Charts v3 Beta Container */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full h-50">
          <Chart
            options={{
              data: seriesData,
              primaryAxis,
              secondaryAxes,
              dark: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
