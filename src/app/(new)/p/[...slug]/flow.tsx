'use client';

import React, { useState, useEffect } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { LogOut, Flame, Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import OverviewFLow from './flow.overview';
import EngageFLow from './flow.engage';
import ExplainFLow from './flow.explain';
import ExploreFLow from './flow.explore';
import CheckpointFLow from './flow.checkpoint';
import ResultFLow from './flow.result';
import useApi from '@/data/hooks/use-api';
import { usePlayServerMode } from '@/hooks/use-play-mode';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/data/key-factory';
import { match, P } from 'ts-pattern';
import { Infer } from '@/data/types.base';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/lib/constants/paths';
import { toastManager } from '@/components/ui/toast';

const TAB_FLOW = [
  { render: OverviewFLow, backLabel: 'Back', nextLabel: 'Start Learning' },
  { render: EngageFLow, backLabel: 'Back', nextLabel: 'Continue' },
  { render: ExplainFLow, backLabel: 'Back', nextLabel: 'Continue' },
  { render: ExploreFLow, backLabel: 'Back', nextLabel: 'Continue' },
  { render: CheckpointFLow, backLabel: 'Back', nextLabel: 'Continue' },
  { render: ResultFLow, backLabel: 'Retake Lesson', nextLabel: 'Back to Modules' },
];

export type IFlowContent = {
  id: string;
  mode: "session" | "module";
  progress?: number;
};

type IFlow = {
  mode: "session" | "module";
  id: string;
}

type INav = Infer["SimGeneralGetNavigate"]["res"];

export default function FLow(props: IFlow) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);
  const isHost = useStore(simStore, (s) => s.getSessionInfo(props.id)?.isHost) ?? false;
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(props.id)) || '';

  const navParams = {
    mode: serverMode,
    playId: props.id,
    playerId,
  };

  const { data: nav, isLoading: isNavQueryLoading } = useApi.query(
    "sim:general:get:navigate", {
    params: navParams,
    query: { isHost },
  }, !isModeLoading);

  const isNavLoading = isModeLoading || isNavQueryLoading || !mounted;

  return (
    <div className="flex-1 bg-surface-white w-full h-dvh min-h-dvh flex flex-col overflow-hidden">
      {match({ nav, isLoading: isNavLoading })
        .with({ isLoading: true }, () => <Content.Loading />)
        .with({ nav: P.select(P.nonNullable) }, (navData) => (
          <Content nav={navData} id={props.id} mode={props.mode} />
        ))
        .with({ nav: P.nullish, isLoading: false }, () => <Content.Error />)
        .exhaustive()
      }
    </div>
  );
}

type IContent = {
  nav: INav;
  id: string;
  mode: "session" | "module";
};

function Content(props: IContent) {
  const { nav, id, mode } = props;
  const tabIndex = nav.currentTab;

  return (
    <Tabs.Root
      value={String(tabIndex)}
      className="relative h-dvh min-h-screen flex flex-col bg-surface-white overflow-hidden"
    >
      <Header id={id} mode={mode} />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {TAB_FLOW.map((content, idx) => (
          <Tabs.Panel key={idx} value={String(idx)} className="flex-1 flex flex-col min-h-0">
            <content.render id={id} mode={mode} progress={nav.progress} />
          </Tabs.Panel>
        ))}
      </main>
      <Footer id={id} mode={mode} tabIndex={tabIndex} />
    </Tabs.Root>
  );
}

Content.Loading = function Loading() {
  return (
    <div className="relative h-dvh min-h-screen flex flex-col items-center justify-center bg-surface-white">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
    </div>
  );
};

Content.Error = function Error() {
  return (
    <div className="relative h-dvh min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-white p-6 text-center">
      <p className="text-normal text-secondary-text">Failed to load navigation state</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="bg-primary-cta text-button text-primary-text-light px-6 h-11 rounded-[10px] hover:bg-primary-hover transition-all cursor-pointer active:scale-98"
      >
        Retry
      </button>
    </div>
  );
};

type IHeader = {
  id: string;
  mode: "session" | "module";
};

function Header(props: IHeader) {
  const { id, mode } = props;
  const router = useRouter();
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(id));
  const isHost = sessionInfo?.isHost ?? false;
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(id)) || '';
  const removeSession = useStore(simStore, (s) => s.removeSession);

  const { mutate: leaveSession, isPending: isLeaving } = useApi.mutate("sim:session:post:leave");
  const { mutate: endSession, isPending: isEnding } = useApi.mutate("sim:session:post:end");

  const isPending = isLeaving || isEnding;

  const handleEndSession = () => {
    endSession(
      { params: { id } },
      {
        onSuccess: () => {
          removeSession(id);
          router.push(PATHS.MODULES);
        },
        onError: (err) => {
          toastManager.add({
            title: err.message || "Failed to end session. Please try again.",
            type: "error",
          });
        },
      }
    );
  };

  const handleLeaveSession = () => {
    if (playerId) {
      leaveSession(
        {
          params: { id },
          body: { playerId },
        },
        {
          onSuccess: () => {
            removeSession(id);
            router.push(PATHS.MODULES);
          },
          onError: (err) => {
            toastManager.add({
              title: err.message || "Failed to leave session. Please try again.",
              type: "error",
            });
          },
        }
      );
    } else {
      removeSession(id);
      router.push(PATHS.MODULES);
    }
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
        className="flex items-center gap-2.5 text-normal text-primary-text-dark hover:text-primary-cta transition-colors cursor-pointer disabled:opacity-50"
      >
        {match(isPending)
          .with(true, () => <Loader2Icon className="size-5 animate-spin text-primary-cta" />)
          .otherwise(() => (
            <>
              <LogOut className="size-5 rotate-180 text-primary-text-dark" />
              <span>{exitConfig.label}</span>
            </>
          ))}
      </button>
    </header>
  );
}

type IFooter = {
  id: string;
  mode: "session" | "module";
  tabIndex: number;
};

function Footer(props: IFooter) {
  const { id, mode, tabIndex } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { serverMode } = usePlayServerMode(mode);
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(id));
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(id)) || '';
  const { mutate: navigate, isPending } = useApi.mutate("sim:general:post:navigate");

  if (sessionInfo?.config.controlMode === "tutor-led" && !sessionInfo.isHost) {
    return null;
  }

  const isLastTab = tabIndex === TAB_FLOW.length - 1;
  const isHost = sessionInfo?.isHost ?? false;

  // On session mode result page: if not host, no button is shown
  if (isLastTab && mode === "session" && !isHost) {
    return null;
  }

  const navParams = {
    mode: serverMode,
    playId: id,
    playerId,
  };

  const activeTab = TAB_FLOW[tabIndex] || TAB_FLOW[0];
  const isPrevDisabled = tabIndex === 0 || isPending;

  const [navTarget, setNavTarget] = useState<number | null>(null);

  const handleNavigate = (nextTab: number) => {
    if (nextTab < 0 || nextTab >= TAB_FLOW.length) return;
    setNavTarget(nextTab);
    navigate(
      {
        params: navParams,
        query: { isHost },
        body: { nextTab },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS["sim:general:get:navigate"](id),
          });
        },
        onSettled: () => {
          setNavTarget(null);
        },
      }
    );
  };

  const isLeftPending = isPending && navTarget !== null && navTarget < tabIndex;
  const isRightPending = isPending && navTarget !== null && navTarget > tabIndex;

  let leftButtonLabel: React.ReactNode = activeTab.backLabel;
  let leftButtonOnClick = () => handleNavigate(tabIndex - 1);
  let leftButtonDisabled = isPrevDisabled || isPending;

  let rightButtonLabel: React.ReactNode = activeTab.nextLabel;
  let rightButtonOnClick = () => handleNavigate(tabIndex + 1);

  if (isLastTab) {
    if (mode === "session" && isHost) {
      const sessionId = sessionInfo?.sessionId || id;
      leftButtonLabel = "Go to Dashboard";
      leftButtonOnClick = () => router.push(PATHS.SESSION.DASHBOARD);
      leftButtonDisabled = isPending;

      rightButtonLabel = "View Analytics";
      rightButtonOnClick = () => router.push(PATHS.SESSION.ONE.ANALYTICS(sessionId));
    } else if (mode !== "session") {
      leftButtonLabel = "Retake Lesson";
      leftButtonOnClick = () => handleNavigate(0);
      leftButtonDisabled = isPending;

      rightButtonLabel = "Back to Modules";
      rightButtonOnClick = () => router.push(PATHS.MODULES);
    }
  }

  return (
    <footer className="bg-primary-subtle px-8 lg:px-22 flex justify-between items-center z-20 shrink-0 h-24">
      {/* Back / Left Action Button */}
      <button
        type="button"
        onClick={leftButtonOnClick}
        disabled={leftButtonDisabled}
        className={cn(
          'bg-surface-slate text-tertiary text-button w-60 h-15 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(69,157,159,0.3)] flex items-center justify-center transition-all cursor-pointer',
          {
            'opacity-40 cursor-not-allowed': leftButtonDisabled,
            'active:scale-98 hover:bg-surface-white': !leftButtonDisabled,
          }
        )}
      >
        {match(isLeftPending)
          .with(true, () => <Loader2Icon className="size-5 animate-spin text-tertiary" />)
          .otherwise(() => leftButtonLabel)}
      </button>

      {/* Primary / Right Action Button */}
      <button
        type="button"
        onClick={rightButtonOnClick}
        disabled={isPending}
        className={cn(
          'bg-primary-cta text-button text-primary-text-light w-60 h-15 rounded-[10px] flex items-center justify-center hover:bg-primary-hover transition-all cursor-pointer active:scale-98',
          {
            'opacity-70 cursor-not-allowed': isPending,
          }
        )}
      >
        {match(isRightPending)
          .with(true, () => <Loader2Icon className="size-5 animate-spin text-primary-text-light" />)
          .otherwise(() => rightButtonLabel)}
      </button>
    </footer>
  );
}