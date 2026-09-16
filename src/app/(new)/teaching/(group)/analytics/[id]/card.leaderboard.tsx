'use client';

import { useState } from 'react';
import useApi from '@/data/hooks/use-api';
import { AVATARS, AvatarKey } from '@/lib/constants/avatars';

export type ILeaderboardCard = {
  id: string;
};

const INITIAL_DISPLAY_LIMIT = 10;

export default function LeaderboardCard(props: ILeaderboardCard) {
  const { id } = props;
  const { data: players } = useApi.query("ses:analytics:get:players", { id });
  const [showAll, setShowAll] = useState(false);

  const displayedPlayers = showAll || !players
    ? players
    : players.slice(0, INITIAL_DISPLAY_LIMIT);

  const hasMoreThanLimit = (players?.length ?? 0) > INITIAL_DISPLAY_LIMIT;

  return (
    <div className="col-span-12 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 sm:p-8 rounded-2xl flex flex-col gap-6 shadow-xs">
      {/* Header */}
      <div>
        <h2 className="text-h6 sm:text-h5 font-bold text-secondary-text">
          Leaderboard
        </h2>
      </div>

      {/* Leaderboard List */}
      <div className="flex flex-col divide-y divide-surface-slate/60">
        {!players || players.length === 0 ? (
          <div className="py-8 text-center text-caption text-tertiary">
            No students found
          </div>
        ) : (
          displayedPlayers?.map((player, idx) => {
            const avatarKey = player.avatar as AvatarKey | undefined;
            const avatarInfo = (avatarKey && avatarKey in AVATARS)
              ? AVATARS[avatarKey]
              : AVATARS["avatar-01"];

            return (
              <div
                key={player.id}
                className="flex items-center justify-between py-3.5 first:pt-0"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="w-4 text-center text-caption sm:text-body font-medium text-tertiary">
                    {idx + 1}
                  </span>
                  <div className="size-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={avatarInfo.image}
                      alt={player.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="text-caption sm:text-body font-medium text-secondary-text">
                    {player.name}
                  </span>
                </div>

                <span className="text-caption sm:text-body font-medium text-tertiary">
                  {player.playAttempt?.accumulatedPoints ?? 0} pts
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* View All Students Button */}
      {hasMoreThanLimit && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 px-4 bg-primary-light/60 hover:bg-primary-light border border-primary-cta/20 rounded-xl text-caption sm:text-small font-semibold text-secondary-text transition-colors text-center cursor-pointer"
        >
          View All Students
        </button>
      )}
    </div>
  );
}
