'use client';

import { useRouter } from 'next/navigation';
import { IFlowContent } from './flow';
import { match, P } from 'ts-pattern';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import { PATHS } from '@/lib/constants/paths';
import { toastManager } from '@/components/(new)/common/toast';
import Leaderboard from '@/components/(new)/play/leaderboard';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';
import { CheckCircle2Icon, Loader2Icon } from 'lucide-react';

type IDetail = Infer["SimModuleGetOne"]["res"];
type IPlayers = Infer["SimSessionGetPlayers"]["res"];
type IHostResultFlow = {} & IFlowContent;

export default function HostContent(props: IHostResultFlow) {
  const { data: players, isLoading: ILPlayers } = useApi.query("sim:session:get:players", { id: props.id });

  const { data: detail, isLoading: ILDetails } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(props.id));
  const isTutorLedSession = sessionInfo?.config.controlMode === "tutor-led";

  const isLoading = ILDetails || ILPlayers;

  return (
    <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between gap-12 lg:gap-16 flex-col lg:flex-row">
      <div className="flex-1 w-full">
        {match({ detail, isLoading })
          .with({ isLoading: true }, () => <StateLoading />)
          .with({ detail: P.nonNullable }, ({ detail }) => (
            <HostResult
              id={props.id}
              detail={detail}
              players={players ?? []}
              isTutorLedSession={isTutorLedSession}
            />
          ))
          .otherwise(() => <StateError />)}
      </div>

      <div className="flex-1 size-full min-h-0 flex-center">
        <Leaderboard playId={props.id} />
      </div>
    </div>
  );
}

function HostResult({ id, detail, players, isTutorLedSession }: { id: string; detail: IDetail; players: IPlayers; isTutorLedSession: boolean }) {
  const router = useRouter();
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(id));
  const removeSession = useStore(simStore, (s) => s.removeSession);

  const { mutate: endSession, isPending: isEnding } = useApi.mutate("sim:session:post:end");

  const totalPlayers = players.length;
  const maxPlayers = sessionInfo?.config?.maxAdmissions ?? 25;
  const attendancePercentage = maxPlayers > 0 ? Math.round((totalPlayers / maxPlayers) * 100) : 0;

  const totalScore = players.reduce((acc, p) => acc + (p.score ?? 0), 0);
  const avgScorePercentage = totalPlayers > 0 ? Math.round(totalScore / totalPlayers) : 0;

  const handleEndSession = () => {
    endSession({ params: { id } }, {
      onSuccess: () => {
        removeSession(id);
        simStore.getState().resetPlayState(id);
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
    <div className="flex-1 flex flex-col gap-8 py-4 items-center text-center lg:items-start lg:text-left">
      {/* Title and Facilitator Subtext */}
      <div className="flex flex-col gap-2.5">
        <h1 className="text-h2 text-primary-cta leading-tight">
          Session Overview
        </h1>
        <p className="text-normal text-primary-text-dark max-w-xl">
          Review your class results for <span className="text-primary-cta font-semibold">{detail.module.title}</span> before concluding the live session.
        </p>
      </div>

      {/* Metrics Row (Students Joined & Average Score) */}
      <div className="flex flex-row gap-4 w-full max-w-xl">
        {/* Card 1: Students Joined */}
        <div className="flex-1 bg-primary-subtle rounded-2xl p-5 border border-primary-light flex flex-col justify-between gap-3 shadow-xs text-left">
          <span className="text-caption font-semibold uppercase tracking-wider text-tertiary">
            STUDENTS JOINED
          </span>
          <span className="text-h3 sm:text-h2 font-bold text-secondary-text leading-none">
            {totalPlayers} / {maxPlayers}
          </span>
          <div className="flex items-center gap-1.5 text-caption font-medium text-success">
            <CheckCircle2Icon className="size-4 shrink-0" />
            <span>{attendancePercentage}% Attendance</span>
          </div>
        </div>

        {/* Card 2: Average Score */}
        <div className="flex-1 bg-primary-subtle rounded-2xl p-5 border border-primary-light flex flex-col justify-between gap-3 shadow-xs text-left">
          <span className="text-caption font-semibold uppercase tracking-wider text-tertiary">
            AVERAGE SCORE
          </span>
          <span className="text-h3 sm:text-h2 font-bold text-secondary-text leading-none">
            {avgScorePercentage}%
          </span>
          <span className="text-caption text-tertiary">
            Class average score
          </span>
        </div>
      </div>

      {/* Full-width End Session Bar */}
      <div className="w-full max-w-xl flex flex-col gap-3">
        <button
          type="button"
          onClick={handleEndSession}
          disabled={isEnding}
          className="w-full h-13.5 bg-error hover:bg-error/90 text-primary-text-light text-button rounded-xl flex-center transition-all cursor-pointer shadow-xs active:scale-98 disabled:opacity-50 font-semibold"
        >
          {isEnding ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            "End Session"
          )}
        </button>

        {isTutorLedSession && (
          <a
            href="https://forms.gle/PKb4w6oCrZ1ekdZg9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-normal text-primary-cta underline underline-offset-2 hover:text-primary-hover transition-colors text-center"
          >
            Take Post-Session Survey
          </a>
        )}
      </div>
    </div>
  );
}
