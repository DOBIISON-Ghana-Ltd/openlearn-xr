import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IOnboardingMetadata } from './schema'

const TABS = ['role', 'school', 'interests'] as const
export type OnboardingTab = typeof TABS[number]

type OnboardingState = {
  currentTab: OnboardingTab
  metadata: Partial<IOnboardingMetadata>

  setTab: (tab: OnboardingTab) => void
  updateMetadata: (patch: Partial<IOnboardingMetadata>) => void
  clearStore: () => void
}

const DEFAULT_STATE: Pick<OnboardingState, 'currentTab' | 'metadata'> = {
  currentTab: 'role',
  metadata: {},
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setTab: (tab) => set({ currentTab: tab }),

      updateMetadata: (patch) =>
        set((state) => ({
          metadata: { ...state.metadata, ...patch },
        })),

      clearStore: () => set(DEFAULT_STATE),
    }),
    {
      name: 'openlearn-onboarding-store',
    },
  ),
)
