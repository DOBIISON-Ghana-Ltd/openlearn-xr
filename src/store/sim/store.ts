import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IStore, ISessionInfo } from './type';

export const simStore = create<IStore>()(
  persist(
    (set, get) => ({
      sessions: {},

      addSession: (joinCode: string, info: ISessionInfo) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [joinCode]: info,
          },
        })),

      getSessionInfo: (joinCode: string) => get().sessions[joinCode],

      getSessionPlayer: (joinCode: string) => get().sessions[joinCode]?.playerId,

      removeSession: (joinCode: string) =>
        set((state) => {
          const { [joinCode]: _, ...rest } = state.sessions;
          return { sessions: rest };
        }),
    }),
    { name: 'simulation-store' }
  )
);


