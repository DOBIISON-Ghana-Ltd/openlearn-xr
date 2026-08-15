import { Infer } from "@/data/types.base";
import { SimulationControl } from "@/local/simulations/type";

export type ISessionInfo = {
  sessionId: string;
  playerId: string | null;
  isHost: boolean;
  config: Infer["ZLiveSession"]["config"];
};

export type ControlValue = number | boolean | string;

export type IStore = {
  // Session Registry (Persisted)
  sessions: Record<string, ISessionInfo>;
  addSession: (joinCode: string, info: ISessionInfo) => void;
  getSessionInfo: (joinCode: string) => ISessionInfo | undefined;
  getSessionPlayer: (joinCode: string) => string | null | undefined;
  removeSession: (joinCode: string) => void;

  // Active Simulation Controls (Transient / Non-Persisted)
  controls: SimulationControl[];
  controlsMap: Record<string, SimulationControl>;

  // Simulation Controls Actions
  initializeControls: (controls: SimulationControl[]) => void;
  updateControl: (id: string, value: ControlValue) => void;
  resetControls: () => void;
  clearControls: () => void;

  // Transient Navigation State (Non-Persisted)
  started: boolean;
  getStarted: () => boolean;
  setStarted: (started: boolean) => void;
  disableNext: boolean;
  getDisableNext: () => boolean;
  setDisableNext: (disableNext: boolean) => void;
  disableBack: boolean;
  getDisableBack: () => boolean;
  setDisableBack: (disableBack: boolean) => void;
};