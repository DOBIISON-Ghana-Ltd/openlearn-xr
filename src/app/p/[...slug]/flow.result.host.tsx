'use client';

import { IFlowContent } from './flow';
import { match, P } from 'ts-pattern';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import { toastManager } from '@/components/common/toast';
import Leaderboard from '@/components/play/leaderboard';
import StateLoading from '@/components/common/state.loading';
import StateError from '@/components/common/state.error';
import SurveyLink from '@/components/common/survey-link';
import { Loader2Icon } from 'lucide-react';
import StatCard from '@/components/common/stats-card';

type IDetail = Infer["SimModuleGetOne"]["res"];
type IMetrics = Infer["SesAnalyticsGetMetrics"]["res"];
type IHostResultFlow = {} & IFlowContent;

export default function HostContent(props: IHostResultFlow) {
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(props.id));
  const sessionId = sessionInfo?.sessionId || '';

  const { data: metrics, isLoading: ILMetrics } = useApi.query("ses:analytics:get:metrics", { id: sessionId }, Boolean(sessionId));

  const { data: detail, isLoading: ILDetails } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  const isLoading = ILDetails || ILMetrics;

  return (
    <div className="w-full max-w-7xl mx-auto h-full flex-center gap-12 lg:gap-16 flex-col lg:flex-row">
      <div className="flex-1 w-full flex justify-center">
        {match({ detail, metrics, isLoading })
          .with({ isLoading: true }, () => <StateLoading />)
          .with({ detail: P.nonNullable, metrics: P.nonNullable }, ({ detail, metrics }) => (
            <HostResult
              id={props.id}
              detail={detail}
              metrics={metrics}
            />
          ))
          .otherwise(() => <StateError />)}
      </div>

      {sessionInfo?.config.allowScoreVisibility ? (
        <div className="flex-1 size-full min-h-0 flex-center">
          <Leaderboard playId={props.id} />
        </div>
      ) : null}
    </div>
  );
}

type IHostResult = {
  id: string;
  detail: IDetail;
  metrics: IMetrics;
};
function HostResult(props: IHostResult) {
  const { id, detail, metrics } = props;
  const removeSession = useStore(simStore, (s) => s.removeSession);

  const { mutate: endSession, isPending: isEnding } = useApi.mutate("sim:session:post:end");

  const handleEndSession = () => {
    endSession({ params: { id } }, {
      onSuccess: () => {
        removeSession(id);
        simStore.getState().resetPlayState('session', id);
      },
      onError: (err) => {
        toastManager.add({
          title: err.message || "Failed to end session. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Title and Facilitator Subtext */}
      <div className="flex flex-col gap-2.5">
        <h1 className="text-h2 text-primary-cta leading-tight">
          Session Overview
        </h1>
        <p className="text-normal text-primary-text-dark max-w-xl">
          Review your class results for <span className="text-primary-cta font-semibold">{detail.module.title}</span> before concluding the live session.
        </p>
      </div>

      {/* Metrics Row (Students Joined, Pre/Post Scores, & Average Improvement) */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        <StatCard
          label="STUDENTS JOINED"
          value={metrics.attendanceScore}
          comment={`${metrics.attendanceAverage}% Attendance`}
          range={metrics.attendanceAverage >= 50 ? "high" : "low"}
        />
        <StatCard
          label="PRE-ASSESSMENT SCORE"
          value={`${metrics.preTestAverage}%`}
          comment="Class baseline"
        />
        <StatCard
          label="POST-ASSESSMENT SCORE"
          value={`${metrics.postTestAverage}%`}
          comment="Class outcome"
        />
        <StatCard
          label="AVERAGE IMPROVEMENT"
          value={metrics.scoreDifference}
          comment="Average score change"
        />
      </div>

      {/* Full-width End Session Bar */}
      <div className="w-full max-w-xl flex flex-col gap-3">
        <button
          type="button"
          onClick={handleEndSession}
          disabled={isEnding}
          className="w-full h-13.5 bg-error hover:bg-error/90 text-primary-text-light text-button rounded-xl flex-center transition-all cursor-pointer shadow-xs active:scale-98 disabled:opacity-50 font-semibold"
        >
          {match(isEnding)
            .with(true, () => <Loader2Icon className="size-5 animate-spin" />)
            .with(false, () => "End Session")
            .exhaustive()
          }
        </button>
        <SurveyLink
          label="Take Post-Session Survey"
          link="https://forms.gle/PKb4w6oCrZ1ekdZg9"
        />
      </div>
    </div>
  );
}