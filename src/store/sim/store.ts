import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IStore } from './type';

export const simStore = create<IStore>()(
  persist(
    (set, get) => ({
      sessions: {},

      addSession: (s: string, p: string) =>
        set((state) => ({
          sessions: { ...state.sessions, [s]: p },
        })),
      getSessionPlayer: (s: string) => get().sessions[s],
      removeSession: (s: string) =>
        set((state) => {
          const { [s]: _, ...rest } = state.sessions;
          return { sessions: rest };
        }),
    }),
    { name: 'simulation-store' }
  )
);
