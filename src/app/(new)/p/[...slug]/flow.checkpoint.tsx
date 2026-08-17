'use client';

import { useEffect } from 'react';
import { IFlowContent } from './flow';
import { match } from 'ts-pattern';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import HostContent from './flow.checkpoint.host';
import NormalContent from './flow.checkpoint.normal';

type ICheckpointFlow = {} & IFlowContent;

export default function CheckpointFLow(props: ICheckpointFlow) {
  const isHost = useStore(simStore, (s) => s.getSessionInfo(props.id)?.isHost) ?? false;

  useEffect(() => {
    simStore.getState().setDisableBack(false);
    simStore.getState().setDisableNext(!isHost);
  }, [isHost]);

  return (
    <div className="flex-1 bg-surface-white pt-5 pb-8 px-6 lg:pl-86.25 lg:pr-8 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-3xl flex flex-col items-start gap-4">
        {/* Main Title (Figma Node 1:1728) */}
        <h1 className="text-h2 text-primary-cta leading-tight">
          Assessment
        </h1>

        {/* Subtext (Figma Node 1:1729) */}
        <p className="text-normal text-primary-text-dark leading-normal w-full max-w-2xl">
          {isHost
            ? "Guide students through the checkpoint questions"
            : "Answer the questions to show what you have learnt"}
        </p>

        {match(isHost)
          .with(true, () => <HostContent {...props} />)
          .with(false, () => <NormalContent {...props} />)
          .exhaustive()}
      </div>
    </div>
  );
}