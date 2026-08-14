'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { LogOut, Loader2Icon } from 'lucide-react';
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

export type IFlowContent = {
  id: string;
  mode: "session" | "module";
  progress?: number;
};

type IFlow = {
  mode: "session" | "module";
  id: string;
};

type INav = Infer["SimGeneralGetNavigate"]["res"];

type ITabFlowItem = {
  render: React.ComponentType<any>;
  back: {
    label: string;
    goto: number | string;
  };
  next: {
    label: string;
    goto: number | string;
  };
};

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
          <Content
            nav={navData}
            id={props.id}
            mode={props.mode}
          />
        ))
        .with({ nav: P.nullish, isLoading: false }, () => <Content.Error />)
        .exhaustive()}
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
  const [tabIndex, setTabIndex] = useState<number>(0);
  const isInitialMount = useRef(true);
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(id));
  const sessionId = sessionInfo?.sessionId || '';
  const isHost = sessionInfo?.isHost ?? false;
  const playerId = sessionInfo?.playerId || "";

  useEffect(() => {
    // Skip setting tabIndex on the initial mount so Overview (0) is displayed first
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // On any subsequent update (clicking Start Learning, next, or WebSocket tab:change), sync tabIndex
    setTabIndex(nav.currentTab);
  }, [nav.currentTab]);

  const tabFlow: ITabFlowItem[] = [
    {
      render: OverviewFLow,
      back: { label: "Back", goto: 0 },
      next: { label: "Start Learning", goto: 1 },
    },
    {
      render: EngageFLow,
      back: { label: "Back", goto: 0 },
      next: { label: "Continue", goto: 2 },
    },
    {
      render: ExplainFLow,
      back: { label: "Back", goto: 1 },
      next: { label: "Continue", goto: 3 },
    },
    {
      render: ExploreFLow,
      back: { label: "Back", goto: 2 },
      next: { label: "Continue", goto: 4 },
    },
    {
      render: CheckpointFLow,
      back: { label: "Back", goto: 3 },
      next: { label: "Continue", goto: 5 },
    },
    {
      render: ResultFLow,
      back: isHost
        ? { label: "Go to Dashboard", goto: PATHS.SESSION.DASHBOARD }
        : { label: "Retake Lesson", goto: "refresh" },
      next: isHost
        ? { label: "View Analytics", goto: PATHS.SESSION.ONE.ANALYTICS(sessionId) }
        : { label: "Back to Modules", goto: PATHS.MODULES },
    },
  ];

  return (
    <Tabs.Root
      value={String(tabIndex)}
      className="relative h-dvh min-h-screen flex flex-col bg-surface-white overflow-hidden"
    >
      <Header id={id} mode={mode} />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {tabFlow.map((content, idx) => (
          <Tabs.Panel key={idx} value={String(idx)} className="flex-1 flex flex-col min-h-0">
            <content.render id={id} mode={mode} progress={nav.progress} />
          </Tabs.Panel>
        ))}
      </main>
      {!(sessionInfo?.config.controlMode === "tutor-led" && !isHost) && (
        <Footer
          id={id}
          mode={mode}
          playerId={playerId}
          isHost={isHost}
          tabIndex={tabIndex}
          tabFlow={tabFlow}
        />
      )}
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
    endSession({ params: { id } }, {
      onSuccess: () => {
        removeSession(id);
        router.push(PATHS.MODULES);
      },
      onError: (err) => {
        toastManager.add({ title: err.message || "Failed to end session. Please try again.", type: "error" });
      },
    });
  };

  const handleLeaveSession = () => {
    if (!playerId) {
      removeSession(id);
      router.push(PATHS.MODULES);
      return;
    }

    leaveSession({ params: { id }, body: { playerId } }, {
      onSuccess: () => {
        removeSession(id);
        router.push(PATHS.MODULES);
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
  playerId: string;
  isHost: boolean;
  tabIndex: number;
  tabFlow: ITabFlowItem[];
};

function Footer(props: IFooter) {
  const { id, mode, playerId, isHost, tabIndex, tabFlow } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { serverMode } = usePlayServerMode(mode);
  const { mutate: navigate, isPending } = useApi.mutate("sim:general:post:navigate");

  const activeTab = tabFlow[tabIndex] || tabFlow[0];
  const { back, next } = activeTab;

  const handleAction = (goto: number | string) => {
    if (goto === "refresh") {
      window.location.reload();
      return;
    }

    if (typeof goto === "string") {
      router.push(goto);
      return;
    }

    navigate({
      params: { mode: serverMode, playId: id, playerId },
      body: { nextTab: goto, isHost },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS["sim:general:get:navigate"](id),
        });
      },
    });
  };

  return (
    <footer className="bg-primary-subtle px-8 lg:px-22 flex justify-between items-center z-20 shrink-0 h-24">
      {/* Back / Left Action Button */}
      <button
        type="button"
        onClick={() => handleAction(back.goto)}
        disabled={isPending || tabIndex === 0}
        className="bg-surface-slate text-tertiary text-button w-60 h-15 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(69,157,159,0.3)] flex items-center justify-center transition-all cursor-pointer hover:bg-surface-white active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        {back.label}
      </button>

      {/* Primary / Right Action Button */}
      <button
        type="button"
        onClick={() => handleAction(next.goto)}
        disabled={isPending}
        className="bg-primary-cta text-button text-primary-text-light w-60 h-15 rounded-[10px] flex items-center justify-center hover:bg-primary-hover transition-all cursor-pointer active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        {next.label}
      </button>
    </footer>
  );
}