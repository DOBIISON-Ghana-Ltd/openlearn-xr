export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  SIGNUP: 'signup',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  MODULE_SELECTED: 'module_selected',
  MODULE_PLAY_STARTED: 'module_play_started',
  SESSION_PLAY_STARTED: 'session_play_started',
  SESSION_COMPLETED: 'session_completed',
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
