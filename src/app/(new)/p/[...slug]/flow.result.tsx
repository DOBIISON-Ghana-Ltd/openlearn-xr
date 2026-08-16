'use client';

import { useEffect } from 'react';
import { IFlowContent } from './flow';
import { match } from 'ts-pattern';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import HostContent from './flow.result.host';
import NormalContent from './flow.result.normal';

type IResultFlow = {} & IFlowContent;

export default function ResultFLow(props: IResultFlow) {
  const isHost = useStore(simStore, (s) => s.getSessionInfo(props.id)?.isHost) ?? false;

  useEffect(() => {
    simStore.getState().setDisableNext(false);
    simStore.getState().setDisableBack(false);
  }, []);

  return (
    <div className="relative flex-1 bg-surface-white p-6 lg:px-20 overflow-y-auto w-full min-h-0 flex flex-col justify-center">
      {match(isHost)
        .with(true, () => <HostContent {...props} />)
        .with(false, () => <NormalContent {...props} />)
        .exhaustive()}
    </div>
  );
}