'use client';

import React, { useState, useEffect } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import OverviewFLow from './flow.overview';
import EngageFLow from './flow.engage';
import ExplainFLow from './flow.explain';
import ExploreFLow from './flow.explore';
import CheckpointFLow from './flow.checkpoint';
import ResultFLow from './flow.result';
import Header from '@/components/(new)/play/header';
import Footer, { ITabFlowItem } from '@/components/(new)/play/footer';
import useApi from '@/data/hooks/use-api';
import { usePlayServerMode } from '@/hooks/use-play-mode';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import { match, P } from 'ts-pattern';
import { Infer } from '@/data/types.base';
import { PATHS } from '@/lib/constants/paths';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';

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

export default function FLow(props: IFlow) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      simStore.getState().setStarted(false);
      simStore.getState().setDisableNext(false);
      simStore.getState().setDisableBack(false);
      simStore.getState().clearControls();
    };
  }, []);

  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);
  const isHost = useStore(simStore, (s) => s.getSessionInfo(props.id)?.isHost) ?? false;
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(props.id)) || '';

  const navParams = {
    mode: serverMode,
    playId: props.id,
    playerId,
  };

  const { data: nav, isLoading: isNavQueryLoading } = useApi.query("sim:general:get:navigate", {
    params: navParams,
    query: { isHost },
  }, !isModeLoading);

  const isNavLoading = isModeLoading || isNavQueryLoading || !mounted;

  return (
    <div className="flex-1 bg-surface-white w-full h-dvh min-h-dvh flex flex-col overflow-hidden">
      {match({ nav, isLoading: isNavLoading })
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ nav: P.select(P.nonNullable) }, (navData) => (
          <Content
            nav={navData}
            id={props.id}
            mode={props.mode}
          />
        ))
        .with({ nav: P.nullish, isLoading: false }, () => <StateError message="Failed to load navigation state" />)
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
  const started = useStore(simStore, (s) => s.started);
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(id));
  const sessionId = sessionInfo?.sessionId || '';
  const isHost = sessionInfo?.isHost ?? false;
  const playerId = sessionInfo?.playerId || "";

  const tutorLedPlayer = sessionInfo?.config.controlMode === "tutor-led" && !isHost;
  const tabIndex = !started && !tutorLedPlayer ? 0 : nav.currentTab;

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
        : { label: "Retake Lesson", goto: "retake" },
      next: isHost
        ? { label: "View Analytics", goto: PATHS.SESSION.ONE.ANALYTICS(sessionId) }
        : { label: "Back to Modules", goto: PATHS.MODULES },
    },
  ];

  const isSessionEndPlayer = mode === "session" && !isHost && started && nav.currentTab === 5;
  const hideFooter = tutorLedPlayer || isSessionEndPlayer;

  return (
    <Tabs.Root
      value={String(tabIndex)}
      className="relative h-dvh min-h-screen flex flex-col bg-surface-white overflow-hidden"
    >
      <Header id={id} mode={mode} currentTab={tabIndex} />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {tabFlow.map((content, idx) => (
          <Tabs.Panel key={idx} value={String(idx)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <content.render id={id} mode={mode} progress={nav.progress} />
          </Tabs.Panel>
        ))}
      </main>
      {!hideFooter && (
        <Footer
          id={id}
          mode={mode}
          playerId={playerId}
          isHost={isHost}
          tabIndex={tabIndex}
          navCurrentTab={nav.currentTab}
          tabFlow={tabFlow}
        />
      )}
    </Tabs.Root>
  );
}