'use client';

import { cn } from '@/lib/utils/cn';
import { Infer } from '@/data/types.base';
import { Loader2Icon } from 'lucide-react';
import useApi from '@/data/hooks/use-api';
import { match, P } from 'ts-pattern';

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
        .with({ isLoading: true }, () => <Leaderboard.Loading />)
        .with({ players: P.select(P.nonNullable) }, (players) => (
          <Leaderboard.Content players={players} />
        ))
        .with({ players: P.nullish, isLoading: false }, () => <Leaderboard.Error />)
        .exhaustive()}
    </>
  );
}

Leaderboard.Content = function Content(props: { players: IPlayers }) {
  const { players } = props;

  return (
    <div className="w-full max-w-135 flex flex-col gap-3.5 pr-6">
      {players.map((item, index) => (
        <div key={item.id ?? index} className="flex items-center gap-4 w-full">
          {/* Point Label */}
          <div className="w-15 sm:w-17.5 shrink-0 text-right text-h6 font-bold text-primary-cta">
            {`${item.score ?? 0}p`}
          </div>

          {/* Progress Bar Container */}
          <div className="flex-1 bg-transparent rounded-[3.1px] h-[46.7px] relative flex items-center">
            <div className='h-full rounded-[3.1px] px-6 flex items-center justify-between relative transition-all duration-500 shadow-sm bg-accent-gold w-full'>
              {/* Name & YOU Label */}
              <div className="flex flex-col justify-center text-primary-text-light leading-tight">
                <span className="text-h6 font-normal text-primary-text-light drop-shadow-xs">
                  {item.name}
                </span>
              </div>

              {/* Floating Avatar / Emoji Circle Badge */}
              <div className="absolute -right-5 size-[46.7px] bg-surface-white rounded-full flex items-center justify-center shadow-md border-[2.3px] border-surface-white z-10">
                <span className="text-[22px] sm:text-[24px] select-none">🏅</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Leaderboard.Loading = function Loading() {
  return (
    <div className="relative flex-1 flex-center flex-col size-full min-h-0 py-16">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
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
