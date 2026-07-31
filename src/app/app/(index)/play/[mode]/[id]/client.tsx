"use client";

import { useEffect, useState } from "react";
import useApi from "@/data/hooks/use-api";
import { useRealtime } from "@/adapters/realtime/client";
import { QUERY_KEYS } from "@/data/key-factory";
import { useStore } from "zustand";
import { simStore } from "@/store/sim/store";
import WindowEntrance from "./window.entrance";
import WindowLobby from "./window.lobby";
import WindowPlay from "./window.play";
import { match } from "ts-pattern";
import { LoaderIcon } from "lucide-react";
import { nuqs } from "@/lib/utils/nuqs";

export type IClientPage = {
  mode: "session" | "module" | "library";
  id: string;
}

export default function ClientPage(props: IClientPage) {
  const { mode, id } = props;
  const [mounted, setMounted] = useState(false);
  const socket = useRealtime();
  const [, setParams] = nuqs.getStates("sim:play");
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(id));

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: sesStats,
    isLoading: ILSesStats,
    isError: IESesStats,
    error: EsesStats,
  } = useApi.query("sim:session:get:stats", { id }, mode === "session");

  const {
    data: modStats,
    isLoading: ILModStats,
    isError: IEModStats,
    error: EmodStats,
  } = useApi.query("sim:module:get:stats", { id }, mode === "module" || mode === "library");

  const hasPlayer = !!playerId;
  const isSession = mode === "session";
  const isSingle = mode === "module" || mode === "library";

  const isLoading = !mounted || (isSession && ILSesStats) || (isSingle && ILModStats);
  const isError = (isSession && IESesStats) || (isSingle && IEModStats);

  const errorMessage = isError ? (EsesStats?.message || EmodStats?.message || "An error occurred.") : null;

  const matchState = {
    isLoading: isLoading as boolean,
    isError: isError as boolean,
    mode,
    status: mode === "session" ? sesStats?.status : modStats?.status,
    hasPlayer,
    allowLateJoin: mode === "session" ? (sesStats?.config?.allowLateAdmissions ?? true) : true,
  } as const;

  const isLive = sesStats?.status === "STAGING" || sesStats?.status === "ACTIVE";

  useEffect(() => {
    if (mode === "session" && !ILSesStats && sesStats?.id && isLive) {
      const subscription = socket.subscribe(sesStats.id, {
        "session:started": () => QUERY_KEYS["sim:session:get:stats"](id),
        "player:joined": () => QUERY_KEYS["sim:session:get:players"](id),
        "player:left": () => QUERY_KEYS["sim:session:get:players"](id),
      });

      return () => {
        subscription.unbind();
        subscription.unsubscribe();
      };
    }
  }, [mode, sesStats?.id, isLive, ILSesStats, id, socket]);

  useEffect(() => {
    if (hasPlayer) {
      setParams({ code: null });
    }
  }, [hasPlayer]);

  return (
    <>
      {match(matchState)
        // 1. Loading State
        .with({ isLoading: true }, () => <ClientPage.Loading />)

        // 2. Error State
        .with({ isError: true }, () => <ClientPage.Error message={errorMessage ?? undefined} />)

        // 3. Module & Library Modes
        .with({ mode: "module" }, { mode: "library" }, () => <WindowPlay {...props} />)

        // 4. Session Mode - Staging Status
        .with({ mode: "session", status: "STAGING", hasPlayer: false }, () => <WindowEntrance id={id} />)
        .with({ mode: "session", status: "STAGING", hasPlayer: true }, () => <WindowLobby id={id} />)

        // 5. Session Mode - Active Status
        .with({ mode: "session", status: "ACTIVE", hasPlayer: true }, () => <WindowPlay {...props} />)
        .with({ mode: "session", status: "ACTIVE", hasPlayer: false, allowLateJoin: true }, () => <WindowEntrance id={id} />)
        .with({ mode: "session", status: "ACTIVE", hasPlayer: false, allowLateJoin: false }, () => (
          <ClientPage.Error message="Late admissions are not allowed." />
        ))

        // Otherwise
        .otherwise(() => <ClientPage.Error message="Simulation not available." />)
      }
    </>
  );
}

ClientPage.Loading = function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

type IError = {
  message?: string
}
ClientPage.Error = function Error({ message }: IError) {
  return (
    <div className="flex size-full items-center justify-center text-red-500 font-medium">
      {message || "error message"}
    </div>
  );
};