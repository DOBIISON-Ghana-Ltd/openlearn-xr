'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';
import useApi from '@/data/hooks/use-api';
import { useStore } from 'zustand';
import { simStore } from '@/store/sim/store';
import { useRealtime } from '@/adapters/realtime/client';
import { QUERY_KEYS } from '@/data/key-factory';
import { PATHS } from '@/lib/constants/paths';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';
import Lobby from './lobby';
import Entrance from './entrance';
import Flow from './flow';

export interface IClientPage {
  mode: 'session' | 'module';
  id: string | null;
}

export default function ClientPage(props: IClientPage) {
  const { mode, id } = props;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const socket = useRealtime();

  const safeId = id ?? '';
  const getRecentSession = useStore(simStore, (s) => s.getRecentSession);
  const addSession = useStore(simStore, (s) => s.addSession);
  const sessionInfo = useStore(simStore, (s) => s.getSessionInfo(safeId));
  const hasPlayer = Boolean(sessionInfo?.playerId);

  const { data: stats, isLoading, isError, error } = useApi.query(
    'sim:session:get:stats',
    { id: safeId },
    mode === 'session' && Boolean(id)
  );

  const isHost = Boolean(stats?.isHost ?? sessionInfo?.isHost);
  const isLive = stats?.status === 'STAGING' || stats?.status === 'ACTIVE';

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Auto-redirect to recent active session if visiting /p/session without code
  useEffect(() => {
    if (mode === 'session' && !id && mounted) {
      const recentCode = getRecentSession();
      if (recentCode) {
        router.replace(PATHS.PLAY('session', recentCode));
      }
    }
  }, [mode, id, mounted, router, getRecentSession]);

  // 2. Host sync & routing (staging -> waiting room, inactive -> analytics)
  useEffect(() => {
    if (!stats || !stats.isHost || !stats.sessionId || !id) return;

    if (!isLive) {
      router.replace(PATHS.TEACHING.ANALYTICS.DETAIL(stats.sessionId));
      return;
    }

    addSession(id, {
      sessionId: stats.sessionId,
      playerId: null,
      isHost: true,
      config: stats.config,
    });

    if (stats.status === 'STAGING') {
      router.replace(PATHS.TEACHING.SESSIONS.DETAIL(id));
    }
  }, [stats, isLive, id, addSession, router]);

  // 3. Clear session info and redirect player to clean entrance if session has ended/completed/cancelled
  useEffect(() => {
    if (mode === 'session' && id && stats?.status && !isLive) {
      simStore.getState().removeSession(id);
      simStore.getState().resetPlayState('session', id);
      if (!isHost) {
        router.replace(PATHS.PLAY('session'));
      }
    }
  }, [mode, id, stats?.status, isLive, isHost, router]);

  // 4. Purge invalid/deleted session from store on 404 to break zombie redirect loop
  useEffect(() => {
    if (isError && id) {
      simStore.getState().removeSession(id);
    }
  }, [isError, id]);

  // 5. Subscribe to realtime session events when joined & live (or host)
  useEffect(() => {
    if (mode === 'session' && (hasPlayer || isHost) && isLive && id) {
      const subscription = socket.subscribe(id, {
        'session:started': () => QUERY_KEYS['sim:session:get:stats'](id),
        'session:ended': () => QUERY_KEYS['sim:session:get:stats'](id),
        'player:joined': () => QUERY_KEYS['sim:session:get:players'](id),
        'player:left': () => QUERY_KEYS['sim:session:get:players'](id),
        'player:updated': () => QUERY_KEYS['sim:session:get:players'](id),
        'tab:change': () => QUERY_KEYS['sim:general:get:navigate'](id),
      });

      return () => {
        subscription.unbind();
        subscription.unsubscribe();
      };
    }
  }, [mode, hasPlayer, isHost, isLive, id, socket]);

  // Prevent flash of entrance while redirecting to recent session
  const isRedirectingRecent = mode === 'session' && !id && mounted && Boolean(getRecentSession());
  const loading = !mounted || (mode === 'session' && Boolean(id) && isLoading) || isRedirectingRecent;

  const matchState = {
    isLoading: loading,
    isError: mode === 'session' && isError,
    mode,
    hasPlayer,
    isHost,
    status: stats?.status,
  };

  return (
    <React.Fragment>
      {match(matchState)
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ isError: true }, () => (<StateError message={error?.message} />))
        .with({ mode: 'session', isHost: true, status: 'STAGING' }, () => <StateLoading />)
        .with(
          { mode: 'session', hasPlayer: true, status: 'ACTIVE' },
          { mode: 'session', isHost: true, status: 'ACTIVE' },
          { mode: 'module' },
          () => (<Flow mode={mode} id={safeId} />)
        )
        .with({ mode: 'session', hasPlayer: true, status: 'STAGING' }, () => (<Lobby />))
        .with({ mode: 'session' }, () => <Entrance {...props} />)
        .exhaustive()}
    </React.Fragment>
  );
}