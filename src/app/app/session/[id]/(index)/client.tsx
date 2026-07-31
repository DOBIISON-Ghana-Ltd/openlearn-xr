"use client";

import { useEffect } from "react";
import { match } from "ts-pattern";
import Cancelled from "./cancelled";
import Content from "./content";
import Lobby from "./lobby";
import useApi from "@/data/hooks/use-api";
import { useRealtime } from "@/adapters/realtime/client";
import { QUERY_KEYS } from "@/data/key-factory";

export type IClientPage = {
  id: string;
}
export default function ClientPage({ id }: IClientPage) {
  const socket = useRealtime();
  const { data: session } = useApi.query("ses:session:get:overview", { id });

  const isLive = session?.status === "STAGING" || session?.status === "ACTIVE";

  useEffect(() => {
    if (session?.id && isLive) {
      const subscription = socket.subscribe(session.id, {
        "session:started": () => QUERY_KEYS["ses:session:get:overview"](id),
        "player:joined": () => QUERY_KEYS["ses:session:get:players"](id),
        "player:left": () => QUERY_KEYS["ses:session:get:players"](id),
      });

      return () => {
        subscription.unbind();
        subscription.unsubscribe();
      };
    }
  }, [session?.id, isLive, id, socket]);

  return (
    <div className="size-full pb-7">
      <div className="w-full py-5 px-5 ">
        <h1 className="text-xl font-normal text-foreground">
          {session?.name}
        </h1>
        <p className="text-base font-normal text-foreground mt-1 flex items-center gap-1.5">
          {session?.moduleVersion.module.title} ( v{session?.moduleVersion.versionNumber} )
        </p>
      </div>
      {match(session?.status || 'STAGING')
        .with('STAGING', () => <Lobby id={id} joinCode={session.joinCode || ""} />)
        .with('CANCELLED', () => <Cancelled />)
        .otherwise(() => <Content id={id} />)
      }
    </div>
  )
}