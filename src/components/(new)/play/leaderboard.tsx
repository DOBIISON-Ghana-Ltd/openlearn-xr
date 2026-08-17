'use client';

import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { match, P } from 'ts-pattern';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { AVATARS } from '@/lib/constants/avatars';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';

type IPlayers = Infer["SimSessionGetPlayers"]["res"];

export type ILeaderboard = {
  playId: string;
};

export default function Leaderboard(props: ILeaderboard) {
  const { data: players, isLoading } = useApi.query("sim:session:get:players", {
    id: props.playId,
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
  const maxScore = Math.max(100, ...players.map((p) => p.score));

  return (
    <ScrollArea.Root className="relative flex flex-col w-full max-w-135 max-h-full min-h-0 overflow-hidden my-auto">
      <ScrollArea.Viewport className="w-full max-h-full min-h-0 rounded-[inherit] outline-none">
        <ScrollArea.Content className="flex flex-col gap-3.5 w-full pr-10">
          {players.map((item) => (
            <LeaderboardItem
              key={item.id}
              data={item}
              maxScore={maxScore}
            />
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className="m-1 flex w-1.5 opacity-0 transition-opacity delay-300 data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-primary-cta/40 hover:bg-primary-cta/60" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

type ILeaderboardItem = {
  data: IPlayers[number];
  maxScore: number;
};

function LeaderboardItem(props: ILeaderboardItem) {
  const { data, maxScore } = props;
  const avatarInfo = AVATARS[data.avatar] ?? AVATARS["avatar-01"];
  const progress = Math.min(100, Math.max(0, (data.score / maxScore) * 100));

  return (
    <div className="flex items-center gap-8 sm:gap-10 w-full">
      {/* Point Label */}
      <div className="w-15 sm:w-17.5 shrink-0 text-right text-h6 font-bold text-primary-cta">
        {`${data.score ?? 0}p`}
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 bg-surface-slate rounded-[3.1px] h-[46.7px] relative flex items-center">
        {/* Colored bar scaling in X direction with the bubble */}
        <div
          className="h-full rounded-[3.1px] transition-all duration-500 shadow-xs"
          style={{
            width: `${progress}%`,
            backgroundColor: avatarInfo.color,
          }}
        />

        {/* Name Label */}
        <div className="absolute left-8 flex flex-col justify-center leading-tight z-10 pointer-events-none">
          <span className="text-h6 font-normal text-primary-text-light drop-shadow-xs">
            {data.name}
          </span>
        </div>

        {/* Profile Bubble */}
        <div
          className="absolute size-[46.7px] bg-surface-white rounded-full flex items-center justify-center shadow-md border-[2.3px] border-surface-white z-20 transition-all duration-500 -translate-x-1/2"
          style={{
            left: `${progress}%`,
          }}
        >
          <img
            src={avatarInfo.image}
            alt={data.name}
            className="size-full rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
