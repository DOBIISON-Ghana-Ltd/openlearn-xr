import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IStore, ISessionInfo, ControlValue } from './type';
import { SimulationControl } from '@/local/simulations/type';

export const simStore = create<IStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      controls: [],
      controlsMap: {},

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

      // Simulation Controls Actions
      initializeControls: (initialControls: SimulationControl[]) => {
        const map: Record<string, SimulationControl> = {};
        initialControls.forEach((ctrl) => {
          map[ctrl.id] = ctrl;
        });
        set({ controls: initialControls, controlsMap: map });
      },

      updateControl: (id: string, value: ControlValue) =>
        set((state) => {
          const existing = state.controlsMap[id];
          if (!existing || existing.value === value) return state;

          const updated = { ...existing, value } as SimulationControl;
          return {
            controlsMap: { ...state.controlsMap, [id]: updated },
            controls: state.controls.map((c) => (c.id === id ? updated : c)),
          };
        }),

      resetControls: () =>
        set((state) => {
          const resetList = state.controls.map(
            (ctrl) =>
              ({
                ...ctrl,
                value: ctrl.defaultValue,
              }) as SimulationControl
          );

          const resetMap: Record<string, SimulationControl> = {};
          resetList.forEach((c) => {
            resetMap[c.id] = c;
          });

          return { controls: resetList, controlsMap: resetMap };
        }),

      clearControls: () => set({ controls: [], controlsMap: {} }),
    }),
    {
      name: 'simulation-store',
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);

export const useSimControlStore = simStore;
export const useSimStore = simStore;

