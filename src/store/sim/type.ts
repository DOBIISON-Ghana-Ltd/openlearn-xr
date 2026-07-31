
export type IStore = {
  sessions: Record<string, string>;
  addSession: (session: string, player: string) => void;
  getSessionPlayer: (session: string) => string | undefined;
  removeSession: (session: string) => void;
};