'use client';

import React from "react";
import { match } from "ts-pattern";
import Lobby from "./lobby";
import Entrance from "./entrance";
import FLow from "./flow";

interface IClientPage {
  mode: 'session' | 'module';
  id: string | null;
}

interface IState {
  mode: IClientPage["mode"],
  flow: "lobby" | "entrance" | "active"
}

export default function ClientPage({ mode, id }: IClientPage) {
  const state: IState = {
    mode: mode,
    flow: "active"
  };

  return (
    <React.Fragment>
      {match(state)
        .with({ mode: "session", flow: "entrance" }, () => <Entrance />)
        .with({ mode: "session", flow: "lobby" }, () => <Lobby />)
        .with({ mode: "session", flow: "active" }, { mode: "module" }, () => <FLow />)
        .exhaustive()
      }
    </React.Fragment>
  );
}
