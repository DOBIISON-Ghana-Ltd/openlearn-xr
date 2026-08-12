'use client';

import React, { useEffect, useState } from 'react';
import { match } from 'ts-pattern';
import { Loader2Icon } from 'lucide-react';
import useApi from '@/data/hooks/use-api';
import { useStore } from 'zustand';
import { simStore } from '@/store/sim/store';
import { useRealtime } from '@/adapters/realtime/client';
import { QUERY_KEYS } from '@/data/key-factory';
import Lobby from './lobby';
import Entrance from './entrance';
import FLow from './flow';

export interface IClientPage {
  mode: 'session' | 'module';
  id: string | null;
}

export default function ClientPage(props: IClientPage) {
  const { mode, id } = props;
  const [mounted, setMounted] = useState(false);
  const socket = useRealtime();

  const playerId = useStore(simStore, (s) => s.getSessionPlayer(id || ''));
  const hasPlayer = Boolean(playerId);

  const { data: stats, isLoading, isError, error } = useApi.query(
    'sim:session:get:stats',
    { id: id || '' }, mode === 'session' && Boolean(id)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLive = stats?.status === 'STAGING' || stats?.status === 'ACTIVE';

  // Subscribe to realtime session events when joined & live
  useEffect(() => {
    if (mode === 'session' && hasPlayer && isLive && id) {
      const subscription = socket.subscribe(id, {
        'session:started': () => QUERY_KEYS['sim:session:get:stats'](id),
        'session:ended': () => QUERY_KEYS['sim:session:get:stats'](id),
        'player:joined': () => QUERY_KEYS['sim:session:get:players'](id),
        'player:left': () => QUERY_KEYS['sim:session:get:players'](id),
        'tab:change': () => QUERY_KEYS['sim:general:get:navigate'](id),
      });

      return () => {
        subscription.unbind();
        subscription.unsubscribe();
      };
    }
  }, [mode, hasPlayer, isLive, id, socket]);

  const loading = !mounted || (mode === 'session' && Boolean(id) && isLoading);

  const matchState = {
    isLoading: loading,
    isError: mode === 'session' && isError,
    mode,
    hasPlayer,
    status: stats?.status,
  };

  return (
    <React.Fragment>
      {match(matchState)
        .with({ isLoading: true }, () => <ClientPage.Loading />)
        .with({ isError: true }, () => (<ClientPage.Error message={error?.message} />))
        .with({ mode: 'session', hasPlayer: true, status: 'ACTIVE' }, { mode: 'module' }, () => (<FLow mode={mode} id={id || ''} />))
        .with({ mode: 'session', hasPlayer: true, status: 'STAGING' }, () => (<Lobby />))
        .with({ mode: 'session' }, () => <Entrance {...props} />)
        .exhaustive()}
    </React.Fragment>
  );
}

ClientPage.Loading = function Loading() {
  return (
    <div className="min-h-dvh w-full flex-center bg-surface-white">
      <Loader2Icon className="size-8 text-primary-cta animate-spin stroke-[2.5]" />
    </div>
  );
};

type IError = {
  message?: string;
};
ClientPage.Error = function Error({ message }: IError) {
  return (
    <div className="min-h-dvh w-full flex-center bg-surface-white p-6">
      <p className="text-body font-medium text-error text-center">
        {message || 'An error occurred while loading the session.'}
      </p>
    </div>
  );
};