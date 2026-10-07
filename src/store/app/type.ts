export type IOnboardingStep =
  | "general"
  | "student:detail"
  | "student:lisense"
  | "teacher:lisense"
  | "final";

export type IStore = {
  onboardingStep: IOnboardingStep;
  setOnboardingStep: (step: IOnboardingStep) => void;
};
