'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePlayServerMode } from '@/hooks/use-play-mode';
import useApi from '@/data/hooks/use-api';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import { QUERY_KEYS } from '@/data/key-factory';

export type ITabFlowItem = {
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

export type IFooter = {
  id: string;
  mode: "session" | "module";
  playerId: string;
  isHost: boolean;
  tabIndex: number;
  navCurrentTab: number;
  tabFlow: ITabFlowItem[];
};

export default function Footer(props: IFooter) {
  const { id, mode, playerId, isHost, tabIndex, navCurrentTab, tabFlow } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { serverMode } = usePlayServerMode(mode);
  const { mutate: navigate, isPending: isNavPending } = useApi.mutate("sim:general:post:navigate");
  const { mutate: retake, isPending: isRetakePending } = useApi.mutate("sim:general:post:retake");
  const isPending = isNavPending || isRetakePending;
  const started = useStore(simStore, (s) => s.started);
  const setStarted = useStore(simStore, (s) => s.setStarted);
  const disableNext = useStore(simStore, (s) => s.disableNext);
  const disableBack = useStore(simStore, (s) => s.disableBack);

  const activeTab = tabFlow[tabIndex] || tabFlow[0];
  const { back, next } = activeTab;

  const handleAction = (goto: number | string) => {
    if (goto === "retake") {
      retake({
        params: { mode: serverMode, playId: id, playerId },
      }, {
        onSuccess: () => {
          setStarted(false);
          simStore.getState().resetPlayState(id);
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS["sim:general:get:navigate"](id),
          });
        },
      });
      return;
    }

    if (typeof goto === "string") {
      router.push(goto);
      return;
    }

    // If on Overview (0) and attempt is already in progress, resume locally without network mutation
    if (tabIndex === 0 && navCurrentTab > 0) {
      setStarted(true);
      return;
    }

    if (!started) {
      setStarted(true);
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

  const surveyUrl =
    tabIndex === 0 && !isHost
      ? "https://forms.gle/VSg1JHokZGcdTZin9"
      : tabIndex === 5 && !isHost
        ? "https://forms.gle/QqXwsL9Xau1BxbMG8"
        : tabIndex === 5 && isHost
          ? "https://forms.gle/PKb4w6oCrZ1ekdZg9"
          : null;

  return (
    <footer className="bg-primary-subtle px-8 lg:px-22 flex-center justify-between z-20 shrink-0 py-3">
      {/* Back / Left Action Button */}
      <button
        type="button"
        onClick={() => handleAction(back.goto)}
        disabled={isPending || tabIndex === 0 || disableBack}
        className="bg-surface-slate text-button text-tertiary w-56 py-4  rounded-lg shadow-[0px_4px_4px_0px_rgba(69,157,159,0.3)] flex-center transition-all cursor-pointer hover:bg-surface-white active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        {back.label}
      </button>

      {/* Survey Link */}
      {surveyUrl && (
        <a
          href={surveyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small text-primary-cta underline underline-offset-2 hover:text-primary-hover transition-colors"
        >
          Take Survey
        </a>
      )}

      {/* Primary / Right Action Button */}
      <button
        type="button"
        onClick={() => handleAction(next.goto)}
        disabled={isPending || disableNext}
        className="bg-primary-cta text-button text-primary-text-light w-56 py-4 rounded-lg shadow-[0px_4px_4px_0px_rgba(69,157,159,0.3)] flex-center hover:bg-primary-hover transition-all cursor-pointer active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        {next.label}
      </button>
    </footer>
  );
}
