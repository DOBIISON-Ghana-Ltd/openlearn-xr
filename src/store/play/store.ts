// ==========================================
// SIMULATION ZUSTAND STORE
// Persisted per-user, per-simulation state
// ==========================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckpointState {
  status: 'pending' | 'completed';
  isCorrect: boolean | null;
  selectedAnswer: string | null;
}

export interface SimSessionData {
  /** controlValues: keyed by SimControlDef.id */
  controlValues: Record<string, any>;
  activeCheckpointId: string | null;
  checkpoints: Record<string, CheckpointState>;
}

export interface SimStore {
  /** The key of the currently active session: `${userId}_${simId}` */
  activeSessionId: string | null;
  /** Persisted dictionary of all session data */
  sessions: Record<string, SimSessionData>;

  // ---- Actions ----
  /** Initialize or restore a session. If a session already exists for this key, it is restored. */
  initSession: (
    userId: string,
    simId: string,
    defaultControls: Record<string, any>,
    checkpointIds: string[]
  ) => void;
  /** Update a single control value in the active session */
  setControl: (controlId: string, value: any) => void;
  /** Set the currently focused checkpoint */
  setActiveCheckpoint: (checkpointId: string) => void;
  /** Record the user's answer for a checkpoint */
  submitCheckpoint: (checkpointId: string, selectedAnswer: string, isCorrect: boolean) => void;
  /** Wipe the active session's data back to defaults */
  resetSession: (defaultControls: Record<string, any>, checkpointIds: string[]) => void;
}

export const useSimStore = create<SimStore>()(
  persist(
    (set, get) => ({
      activeSessionId: null,
      sessions: {},

      initSession: (userId, simId, defaultControls, checkpointIds) => {
        const sessionId = `${userId}_${simId}`;
        const { sessions } = get();

        set({ activeSessionId: sessionId });

        // If a session already exists, restore it — don't overwrite
        if (sessions[sessionId]) return;

        // Build initial checkpoint states
        const checkpoints: Record<string, CheckpointState> = {};
        for (const id of checkpointIds) {
          checkpoints[id] = { status: 'pending', isCorrect: null, selectedAnswer: null };
        }

        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              controlValues: { ...defaultControls },
              activeCheckpointId: checkpointIds[0] ?? null,
              checkpoints,
            },
          },
        }));
      },

      setControl: (controlId, value) => {
        const { activeSessionId, sessions } = get();
        if (!activeSessionId || !sessions[activeSessionId]) return;

        set((state) => ({
          sessions: {
            ...state.sessions,
            [activeSessionId]: {
              ...state.sessions[activeSessionId],
              controlValues: {
                ...state.sessions[activeSessionId].controlValues,
                [controlId]: value,
              },
            },
          },
        }));
      },

      setActiveCheckpoint: (checkpointId) => {
        const { activeSessionId } = get();
        if (!activeSessionId) return;

        set((state) => ({
          sessions: {
            ...state.sessions,
            [activeSessionId]: {
              ...state.sessions[activeSessionId],
              activeCheckpointId: checkpointId,
            },
          },
        }));
      },

      submitCheckpoint: (checkpointId, selectedAnswer, isCorrect) => {
        const { activeSessionId } = get();
        if (!activeSessionId) return;

        set((state) => ({
          sessions: {
            ...state.sessions,
            [activeSessionId]: {
              ...state.sessions[activeSessionId],
              checkpoints: {
                ...state.sessions[activeSessionId].checkpoints,
                [checkpointId]: { status: 'completed', isCorrect, selectedAnswer },
              },
            },
          },
        }));
      },

      resetSession: (defaultControls, checkpointIds) => {
        const { activeSessionId } = get();
        if (!activeSessionId) return;

        const checkpoints: Record<string, CheckpointState> = {};
        for (const id of checkpointIds) {
          checkpoints[id] = { status: 'pending', isCorrect: null, selectedAnswer: null };
        }

        set((state) => ({
          sessions: {
            ...state.sessions,
            [activeSessionId]: {
              controlValues: { ...defaultControls },
              activeCheckpointId: checkpointIds[0] ?? null,
              checkpoints,
            },
          },
        }));
      },
    }),
    {
      name: 'openlearn-sim-storage',
    }
  )
);
