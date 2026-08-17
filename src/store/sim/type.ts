import { Infer } from "@/data/types.base";
import { SimulationControl } from "@/local/simulations/type";

export type ISessionInfo = {
  sessionId: string;
  playerId: string | null;
  isHost: boolean;
  config: Infer["ZLiveSession"]["config"];
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
  isCompleted?: boolean;
};

export type ICheckpointFeedback = {
  questionIndex?: number;
  chosenAnswer: number;
  correctAnswer?: number;
  isCorrect?: boolean;
  explanation?: string;
  pointsAwarded?: number;
};

export type ICheckpointState = {
  activeFeedback?: ICheckpointFeedback;
  answers: Record<number, ICheckpointFeedback>;
  isCompleted?: boolean;
};

export type IStore = {
  // Session Registry (Persisted)
  sessions: Record<string, ISessionInfo>;
  addSession: (joinCode: string, info: ISessionInfo) => void;
  getSessionInfo: (joinCode: string) => ISessionInfo | undefined;
  getSessionPlayer: (joinCode: string) => string | null | undefined;
  removeSession: (joinCode: string) => void;

  // Pre-Assessment & Checkpoint State (Persisted)
  preAssessments: Record<string, ITestState>;
  checkpoints: Record<string, ICheckpointState>;
  setPreAssessmentAnswer: (
    playId: string,
    questionIndex: number,
    answer: ITestFeedback
  ) => void;
  setPreAssessmentActiveIndex: (playId: string, activeIndex: number) => void;
  setCheckpointFeedback: (
    playId: string,
    questionIndex: number,
    feedback: ICheckpointFeedback
  ) => void;
  setCheckpointCompleted: (playId: string, isCompleted: boolean) => void;
  clearCheckpointActiveFeedback: (playId: string) => void;
  resetPlayState: (playId: string) => void;

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