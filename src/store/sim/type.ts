export type ISessionInfo = {
  sessionId: string;
  playerId: string;
};

export type IStore = {
  sessions: Record<string, ISessionInfo>;
  addSession: (joinCode: string, info: ISessionInfo) => void;
  getSessionInfo: (joinCode: string) => ISessionInfo | undefined;
  getSessionPlayer: (joinCode: string) => string | undefined;
  removeSession: (joinCode: string) => void;
};