'use client';

import { useRouter } from 'next/navigation';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import useApi from '@/data/hooks/use-api';
import { toastManager } from '@/components/(new)/common/toast';
import { PATHS } from '@/lib/constants/paths';
import { match } from 'ts-pattern';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const PLAY_TABS = [
  "Overview",
  "Pre-Assessment",
  "Explanation",
  "Explore",
  "Post-Assessment",
  "Results",
] as const;

export type IHeader = {
  id: string;
  mode: "session" | "module";
  currentTab?: number;
};

export default function Header(props: IHeader) {
  const { id, mode, currentTab = 0 } = props;
  const router = useRouter();
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(id));
  const isHost = sessionInfo?.isHost ?? false;
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(id)) || '';
  const removeSession = useStore(simStore, (s) => s.removeSession);

  const { mutate: leaveSession, isPending: isLeaving } = useApi.mutate("sim:session:post:leave");
  const { mutate: endSession, isPending: isEnding } = useApi.mutate("sim:session:post:end");

  const isPending = isLeaving || isEnding;

  const handleEndSession = () => {
    endSession({ params: { id } }, {
      onSuccess: () => {
        removeSession(id);
        simStore.getState().resetPlayState(id);
      },
      onError: (err) => {
        toastManager.add({ title: err.message || "Failed to end session. Please try again.", type: "error" });
      },
    });
  };

  const handleLeaveSession = () => {
    if (!playerId) {
      removeSession(id);
      simStore.getState().resetPlayState(id);
      return;
    }

    leaveSession({ params: { id }, body: { playerId } }, {
      onSuccess: () => {
        removeSession(id);
        simStore.getState().resetPlayState(id);
      },
      onError: (err) => {
        toastManager.add({ title: err.message || "Failed to leave session. Please try again.", type: "error" });
      },
    });
  };

  const handleExitLesson = () => {
    router.push(PATHS.MODULES);
  };

  const exitConfig = match({ mode, isHost })
    .with({ mode: "session", isHost: true }, () => ({
      label: "End Session",
      onClick: handleEndSession,
    }))
    .with({ mode: "session", isHost: false }, () => ({
      label: "Leave Session",
      onClick: handleLeaveSession,
    }))
    .otherwise(() => ({
      label: "Exit Lesson",
      onClick: handleExitLesson,
    }));

  return (
    <header className="bg-surface-slate/70 backdrop-blur-[5px] border-b border-disable/20 px-8 lg:px-20 flex items-center justify-between shrink-0 h-18.25 z-20">
      {/* Left: Exit / Leave / End Action */}
      <button
        type="button"
        onClick={exitConfig.onClick}
        disabled={isPending}
        className="flex items-center gap-2.5 text-normal text-primary-text-dark hover:text-primary-cta transition-colors cursor-pointer disabled:opacity-50 shrink-0"
      >
        <LogOut className="size-5 rotate-180" />
        <span>{exitConfig.label}</span>
      </button>

      {/* Center/Right: Tab Navigation List */}
      <nav className="flex items-center gap-6 lg:gap-10 h-full overflow-x-auto">
        {PLAY_TABS.map((label, idx) => {
          const isActive = currentTab === idx;
          return (
            <div
              key={label}
              className={cn("h-full flex items-center relative text-normal font-medium transition-colors select-none shrink-0", {
                "text-primary-cta": isActive,
                "text-secondary-text opacity-70": !isActive,
              })}
            >
              <span>{label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-cta rounded-t-full" />
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
