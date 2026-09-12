'use client';

import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { match, P } from 'ts-pattern';
import { ScrollArea } from '@/components/(new)/ui/scroll-area';
import { AVATARS } from '@/lib/constants/avatars';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';

type IPlayers = Infer["SimSessionGetPlayers"]["res"];

export type ILeaderboard = {
  playId: string;
};

export default function Leaderboard(props: ILeaderboard) {
  const { playId } = props;

  const { data: players, isLoading } = useApi.query("sim:session:get:players", {
    id: playId,
  });

  return (
    <>
      {match({ players, isLoading })
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ players: P.select(P.nonNullable) }, (p) => <Leaderboard.Content players={p} />)
        .with({ players: P.nullish, isLoading: false }, () => <StateError />)
        .exhaustive()}
    </>
  );
}

Leaderboard.Content = function Content(props: { players: IPlayers }) {
  const { players } = props;
  const maxScore = Math.max(100, ...players.map((p) => p.playAttempt?.accumulatedPoints ?? 0));

  return (
    <ScrollArea fill className="w-full max-w-135 max-h-full min-h-0 my-auto">
      <div className="flex flex-col gap-3.5 w-full pr-10 my-auto">
        {players.map((item) => (
          <LeaderboardItem
            key={item.id}
            data={item}
            maxScore={maxScore}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

type ILeaderboardItem = {
  data: IPlayers[number];
  maxScore: number;
};

function LeaderboardItem(props: ILeaderboardItem) {
  const { data, maxScore } = props;
  const avatarInfo = AVATARS[data.avatar] ?? AVATARS["avatar-01"];
  const score = data.playAttempt?.accumulatedPoints ?? 0;
  const progress = Math.min(100, Math.max(0, (score / maxScore) * 100));

  return (
    <div className="flex-center justify-between gap-8 w-full">
      {/* Point Label */}
      <div className="w-16 shrink-0">
        <p className="text-normal font-normal text-primary-text-dark truncate">
          {data.name}
        </p>
        <p className="text-large font-bold text-primary-cta">
          {`${score}p`}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 bg-surface-slate rounded-sm h-12 relative flex items-center">
        {/* Colored bar scaling in X direction with the bubble */}
        <div
          className="h-full rounded-sm transition-all duration-500 shadow-xs"
          style={{
            width: `${progress}%`,
            backgroundColor: avatarInfo.color,
          }}
        />

        {/* Profile Bubble */}
        <div
          className="absolute size-12 bg-surface-white rounded-full flex-center shadow-md border-2 border-surface-white z-20 transition-all duration-500 -translate-x-1/2"
          style={{ left: `${progress}%` }}
        >
          <img
            className="size-full rounded-full object-cover"
            src={avatarInfo.image}
            alt={data.name}
          />
        </div>
      </div>
    </div>
  );
}
