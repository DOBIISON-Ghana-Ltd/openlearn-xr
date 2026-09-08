import { Infer } from "@/data/types.base";
import { SimulationControl } from "@/local/simulations/type";
import { ServerMode } from "@/data/schema.base";

export type ISessionInfo = {
  sessionId: string;
  playerId: string | null;
  isHost: boolean;
  config: Infer["ZLiveSession"]["config"];
  timestamp?: number;
};

export type ControlValue = number | boolean | string;

export type ITestFeedback = {
  questionIndex: number;
  selectedIndex: number | null;
  hasAnswered: boolean;
  isCorrect: boolean;
};

export type ITestState = {
  activeIndex: number;
  answers: Record<number, ITestFeedback>;
  earnedPoints: number;
  totalPoints: number;
  isCompleted?: boolean;
};

export type ICheckpointFeedback = {
  questionIndex: number;
  chosenAnswer: number;
  correctAnswer?: number;
  isCorrect?: boolean;
  explanation?: string;
  pointsAwarded?: number;
};

export type ICheckpointState = {
  answers: Record<number, ICheckpointFeedback>;
  isCompleted?: boolean;
};

export type IStore = {
  // Session Registry (Persisted)
  sessions: Record<string, ISessionInfo>;
  addSession: (joinCode: string, info: ISessionInfo) => void;
  getSessionInfo: (joinCode: string) => ISessionInfo | undefined;
  getRecentSession: () => string | null;
  removeSession: (joinCode: string) => void;

  // Tests & Checkpoint State (Persisted)
  tests: Record<string, ITestState>;
  checkpoints: Record<string, ICheckpointState>;
  getTestState: (mode: ServerMode, playId: string) => ITestState | undefined;
  getCheckpointFeedback: (
    mode: ServerMode,
    playId: string,
    questionIndex: number
  ) => ICheckpointFeedback | undefined;
  setTestAnswer: (
    mode: ServerMode,
    playId: string,
    questionIndex: number,
    answer: ITestFeedback,
    points?: number,
    nextActiveIndex?: number
  ) => void;
  setTestActiveIndex: (mode: ServerMode, playId: string, activeIndex: number) => void;
  setCheckpointFeedback: (
    mode: ServerMode,
    playId: string,
    questionIndex: number,
    feedback: ICheckpointFeedback
  ) => void;
  setCheckpointCompleted: (mode: ServerMode, playId: string, isCompleted: boolean) => void;
  resetPlayState: (mode: ServerMode, playId: string) => void;

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