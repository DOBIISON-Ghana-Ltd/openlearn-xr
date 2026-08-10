'use client';

import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import { match, P } from 'ts-pattern';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { usePlayServerMode } from '@/hooks/use-play-mode';

type IDetail = Infer["SimModuleGetOne"]["res"];
type IScore = Infer["SimGeneralGetScore"]["res"];
type IPlayers = Infer["SimSessionGetPlayers"]["res"];
type IResultFlow = {} & IFlowContent;

export default function ResultFLow(props: IResultFlow) {
  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);

  const { data: players, isLoading: ILPlayers } = useApi.query(
    "sim:session:get:players",
    { id: props.id },
    props.mode === "session"
  );

  const { data: detail, isLoading: ILDetails } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  const { data: playScore, isLoading: ILPlayScore } = useApi.query(
    "sim:general:get:score",
    {
      params: { playId: props.id },
      query: { mode: serverMode },
    },
    !isModeLoading
  );

  const isResultLoading = ILDetails || ILPlayScore || isModeLoading;

  return (
    <div className="relative flex-1 bg-surface-white p-6 lg:px-20 overflow-y-auto w-full min-h-0 flex flex-col justify-center">
      <div className={cn("w-full max-w-7xl mx-auto min-h-full flex items-center justify-between gap-12 lg:gap-16", {
        "flex-col lg:flex-row": props.mode === "session",
        "flex-col items-center justify-center": props.mode === "module",
      })}>
        <div className="flex-1 w-full">
          {match({ detail, playScore, isLoading: isResultLoading })
            .with({ isLoading: true }, () => <Result.Loading />)
            .with({ detail: P.nonNullable, playScore: P.nonNullable }, ({ detail, playScore }) => (
              <Result
                detail={detail}
                score={playScore.score}
                mode={props.mode}
              />
            ))
            .otherwise(() => <Result.Error />)
          }
        </div>

        {props.mode === "session" && (
          <div className="flex-1 w-full flex justify-center">
            {match({ players, isLoading: ILPlayers })
              .with({ isLoading: true }, () => <Leaderboard.Loading />)
              .with({ players: P.select(P.nonNullable) }, (players) => <Leaderboard players={players} />)
              .with({ players: P.nullish, isLoading: false }, () => <Leaderboard.Error />)
              .exhaustive()
            }
          </div>
        )}
      </div>
    </div>
  );
}

type IResult = {
  detail: IDetail;
  score: number;
  mode: "module" | "session";
};

function Result(props: IResult) {
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

Result.Loading = function Loading() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">Loading...</p>
    </div>
  );
};

Result.Error = function Error() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">An error occurred</p>
    </div>
  );
};

type ILeaderboard = {
  players: IPlayers;
};

function Leaderboard(props: ILeaderboard) {
  const { players } = props;

  return (
    <div className="w-full max-w-[540px] flex flex-col gap-3.5 pr-6">
      {players.map((item, index) => (
        <div key={item.id ?? index} className="flex items-center gap-4 w-full">
          {/* Point Label */}
          <div className="w-[60px] sm:w-[70px] shrink-0 text-right text-h6 font-bold text-primary-cta">
            {`${item.score ?? 0}p`}
          </div>

          {/* Progress Bar Container */}
          <div className="flex-1 bg-transparent rounded-[3.1px] h-[46.7px] relative flex items-center">
            <div
              className={cn(
                'h-full rounded-[3.1px] px-6 flex items-center justify-between relative transition-all duration-500 shadow-sm bg-accent-gold w-full'
              )}
            >
              {/* Name & YOU Label */}
              <div className="flex flex-col justify-center text-primary-text-light leading-tight">
                <span className="text-h6 font-normal text-primary-text-light drop-shadow-xs">
                  {item.name}
                </span>
              </div>

              {/* Floating Avatar / Emoji Circle Badge */}
              <div className="absolute -right-5 size-[46.7px] bg-surface-white rounded-full flex items-center justify-center shadow-md border-[2.3px] border-surface-white z-10">
                <span className="text-[22px] sm:text-[24px] select-none">{item.avatar || "🏅"}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Leaderboard.Loading = function Loading() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">Loading...</p>
    </div>
  );
};

Leaderboard.Error = function Error() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">An error occurred</p>
    </div>
  );
};