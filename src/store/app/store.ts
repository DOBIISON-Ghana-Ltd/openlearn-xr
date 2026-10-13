import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IStore, IOnboardingStep } from './type';

export const appStore = create<IStore>()(
  persist(
    (set) => ({
      onboardingStep: 'general',
      setOnboardingStep: (step: IOnboardingStep) => set({ onboardingStep: step }),
    }),
    { name: 'app-store' }
  ),
);
