'use client';

import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import { match, P } from 'ts-pattern';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { usePlayServerMode } from '@/hooks/use-play-mode';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import Leaderboard from '@/components/(new)/play/leaderboard';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';

type IDetail = Infer["SimModuleGetOne"]["res"];
type INormalResultFlow = {} & IFlowContent;

export default function NormalContent(props: INormalResultFlow) {
  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);

  const { data: detail, isLoading: ILDetails } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  const playerId = useStore(simStore, (s) => s.getSessionPlayer(props.id)) || '';

  const { data: playScore, isLoading: ILPlayScore } = useApi.query(
    "sim:general:get:score",
    {
      params: {
        mode: serverMode,
        playId: props.id,
        playerId,
      },
    },
    !isModeLoading
  );

  const isResultLoading = ILDetails || ILPlayScore || isModeLoading;

  return (
    <div className={cn("w-full max-w-7xl mx-auto h-full flex items-center justify-between gap-6 xl:gap-16", {
      "flex-col lg:flex-row": props.mode === "session",
      "flex-col items-center justify-center": props.mode === "module",
    })}>
      <div className="flex-1 w-full">
        {match({ detail, playScore, isLoading: isResultLoading })
          .with({ isLoading: true }, () => <StateLoading />)
          .with({ detail: P.nonNullable, playScore: P.nonNullable }, ({ detail, playScore }) => (
            <NormalResult
              detail={detail}
              score={playScore.score}
              mode={props.mode}
            />
          ))
          .otherwise(() => <StateError />)
        }
      </div>

      {props.mode === "session" && (
        <div className="flex-1 size-full min-h-0 flex-center">
          <Leaderboard playId={props.id} />
        </div>
      )}
    </div>
  );
}

type IResult = {
  detail: IDetail;
  score: number;
  mode: "module" | "session";
};

function NormalResult(props: IResult) {
  const { detail, score, mode } = props;
  const isSession = mode === "session";

  return (
    <div className={cn("flex-1 flex flex-col gap-10 py-4", {
      "items-center text-center lg:items-start lg:text-left": isSession,
      "items-center text-center": !isSession,
    })}>
      {/* Header Title & Subtitle */}
      <div className="flex flex-col gap-3">
        <h1 className="text-h2 text-primary-cta leading-tight">
          Good Job!
        </h1>
        <p className="text-normal text-primary-text-dark">
          You have completed <span className="text-primary-cta font-semibold">{detail.module.title}</span>.
        </p>
      </div>

      {/* Points Earned Box */}
      <div className={cn("flex-1 flex flex-col gap-1 mt-4", {
        "items-center lg:items-start": isSession,
        "items-center": !isSession,
      })}>
        <span className="text-button text-primary-text-dark">
          Points Earned
        </span>
        <span className="text-display text-primary-cta leading-none mt-1">
          {score}
        </span>
      </div>
    </div>
  );
}
