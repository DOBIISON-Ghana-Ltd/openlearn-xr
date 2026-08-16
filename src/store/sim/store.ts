import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IStore, ISessionInfo, ControlValue, ITestFeedback, ICheckpointFeedback } from './type';
import { SimulationControl } from '@/local/simulations/type';

export const simStore = create<IStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      preAssessments: {},
      checkpoints: {},
      controls: [],
      controlsMap: {},
      started: false,
      disableNext: false,
      disableBack: false,

      getStarted: () => get().started,
      setStarted: (started: boolean) => set({ started }),

      getDisableNext: () => get().disableNext,
      setDisableNext: (disableNext: boolean) => set({ disableNext }),

      getDisableBack: () => get().disableBack,
      setDisableBack: (disableBack: boolean) => set({ disableBack }),

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

      setPreAssessmentAnswer: (playId: string, questionIndex: number, answer: ITestFeedback) =>
        set((state) => {
          const current = state.preAssessments[playId] || {
            activeIndex: 0,
            answers: {},
          };
          return {
            preAssessments: {
              ...state.preAssessments,
              [playId]: {
                ...current,
                answers: {
                  ...current.answers,
                  [questionIndex]: answer,
                },
              },
            },
          };
        }),

      setPreAssessmentActiveIndex: (playId: string, activeIndex: number) =>
        set((state) => {
          const current = state.preAssessments[playId] || {
            activeIndex: 0,
            answers: {},
          };
          return {
            preAssessments: {
              ...state.preAssessments,
              [playId]: {
                ...current,
                activeIndex,
              },
            },
          };
        }),

      setCheckpointFeedback: (playId: string, questionIndex: number, feedback: ICheckpointFeedback) =>
        set((state) => {
          const current = state.checkpoints[playId] || {
            answers: {},
          };
          return {
            checkpoints: {
              ...state.checkpoints,
              [playId]: {
                activeFeedback: feedback,
                answers: {
                  ...current.answers,
                  [questionIndex]: feedback,
                },
              },
            },
          };
        }),

      setCheckpointCompleted: (playId: string, isCompleted: boolean) =>
        set((state) => {
          const current = state.checkpoints[playId] || {
            answers: {},
          };
          return {
            checkpoints: {
              ...state.checkpoints,
              [playId]: {
                ...current,
                isCompleted,
              },
            },
          };
        }),

      clearCheckpointActiveFeedback: (playId: string) =>
        set((state) => {
          const current = state.checkpoints[playId];
          if (!current) return state;
          return {
            checkpoints: {
              ...state.checkpoints,
              [playId]: {
                ...current,
                activeFeedback: undefined,
              },
            },
          };
        }),

      resetPlayState: (playId: string) =>
        set((state) => {
          const { [playId]: _pre, ...remainingPre } = state.preAssessments;
          const { [playId]: _cp, ...remainingCp } = state.checkpoints;
          return {
            preAssessments: remainingPre,
            checkpoints: remainingCp,
          };
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
      partialize: (state) => ({
        sessions: state.sessions,
        preAssessments: state.preAssessments,
        checkpoints: state.checkpoints,
      }),
    }
  )
);

export const useSimControlStore = simStore;
export const useSimStore = simStore;

