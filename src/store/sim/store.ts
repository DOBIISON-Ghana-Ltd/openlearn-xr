import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IStore, ISessionInfo, ControlValue, ITestFeedback, ICheckpointFeedback } from './type';
import { SimulationControl } from '@/local/simulations/type';
import { ServerMode } from '@/data/schema.base';

export const simStore = create<IStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      tests: {},
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
            [joinCode]: {
              ...info,
              timestamp: info.timestamp ?? Date.now(),
            },
          },
        })),

      getSessionInfo: (joinCode: string) => get().sessions[joinCode],

      getRecentSession: () => {
        const entries = Object.entries(get().sessions);
        if (entries.length === 0) return null;

        entries.sort(([, a], [, b]) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
        const [joinCode, info] = entries[0];

        // Expire sessions older than 24 hours
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        if (Date.now() - (info.timestamp ?? 0) > ONE_DAY_MS) {
          return null;
        }

        return joinCode;
      },

      removeSession: (joinCode: string) =>
        set((state) => {
          const { [joinCode]: _, ...rest } = state.sessions;
          return { sessions: rest };
        }),

      getTestState: (mode: ServerMode, playId: string) => get().tests[`${mode}_${playId}`],

      getCheckpointFeedback: (mode: ServerMode, playId: string, questionIndex: number) =>
        get().checkpoints[`${mode}_${playId}`]?.answers?.[questionIndex],

      setTestAnswer: (
        mode: ServerMode,
        playId: string,
        questionIndex: number,
        answer: ITestFeedback,
        points = 25,
        nextActiveIndex?: number
      ) =>
        set((state) => {
          const key = `${mode}_${playId}`;
          const current = state.tests[key] || {
            activeIndex: 0,
            answers: {},
            earnedPoints: 0,
            totalPoints: 0,
          };
          return {
            tests: {
              ...state.tests,
              [key]: {
                ...current,
                activeIndex: nextActiveIndex ?? questionIndex + 1,
                answers: {
                  ...current.answers,
                  [questionIndex]: answer,
                },
                earnedPoints: current.earnedPoints + (answer.isCorrect ? points : 0),
                totalPoints: current.totalPoints + points,
              },
            },
          };
        }),

      setTestActiveIndex: (mode: ServerMode, playId: string, activeIndex: number) =>
        set((state) => {
          const key = `${mode}_${playId}`;
          const current = state.tests[key] || {
            activeIndex: 0,
            answers: {},
            earnedPoints: 0,
            totalPoints: 0,
          };
          return {
            tests: {
              ...state.tests,
              [key]: {
                ...current,
                activeIndex,
              },
            },
          };
        }),

      setCheckpointFeedback: (
        mode: ServerMode,
        playId: string,
        questionIndex: number,
        feedback: ICheckpointFeedback
      ) =>
        set((state) => {
          const key = `${mode}_${playId}`;
          const current = state.checkpoints[key] || {
            answers: {},
          };
          return {
            checkpoints: {
              ...state.checkpoints,
              [key]: {
                ...current,
                answers: {
                  ...current.answers,
                  [questionIndex]: feedback,
                },
              },
            },
          };
        }),

      setCheckpointCompleted: (mode: ServerMode, playId: string, isCompleted: boolean) =>
        set((state) => {
          const key = `${mode}_${playId}`;
          const current = state.checkpoints[key] || {
            answers: {},
          };
          return {
            checkpoints: {
              ...state.checkpoints,
              [key]: {
                ...current,
                isCompleted,
              },
            },
          };
        }),

      resetPlayState: (mode: ServerMode, playId: string) =>
        set((state) => {
          const key = `${mode}_${playId}`;
          const { [key]: _test, ...remainingTests } = state.tests;
          const { [key]: _cp, ...remainingCp } = state.checkpoints;
          return {
            tests: remainingTests,
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
        tests: state.tests,
        checkpoints: state.checkpoints,
      }),
    }
  )
);

export const useSimControlStore = simStore;
export const useSimStore = simStore;

