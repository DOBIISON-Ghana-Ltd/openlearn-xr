import { Infer } from "@/data/types.base";

export type ISessionInfo = {
  sessionId: string;
  playerId: string | null;
  isHost: boolean;
  config: Infer["ZLiveSession"]["config"];
};

export type IStore = {
  sessions: Record<string, ISessionInfo>;
  addSession: (joinCode: string, info: ISessionInfo) => void;
  getSessionInfo: (joinCode: string) => ISessionInfo | undefined;
  getSessionPlayer: (joinCode: string) => string | null | undefined;
  removeSession: (joinCode: string) => void;
};