export const ROUTES = {
  // MARKETING ROUTES
  HOME: '/',
  LICENSING: '/licensing',
  CONTACT: '/contact',
  LEGAL: {
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
    COOKIES: '/legal/cookies'
  },

  // AUTH ROUTES
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ONBOARDING: '/auth/onboarding',
  },

  // SIMULATION SUITE (App Routes)
  SIMS: {
    DASHBOARD: '/app',
    LIBRARY: {
      ROOT: '/app/library',
      ONE: (id: string) => `/app/library/${id}`
    },
    MODULES: '/app/modules',
    PLAY: (mode: string, id?: string) => `/app/play/${mode}/${id}`,
    JOIN: '/app/join',
  },

  // EDITOR SUITE
  EDITOR: {
    DASHBOARD: '/app/editor',
  },

  // SESSION SUITE
  SESSION: {
    DASHBOARD: '/app/session',
  },

  // ADMIN SUITE
  ADMIN: {
    DASHBOARD: '/app/admin',
    ANALYTICS: '/app/admin/analytics',
    MODULES: '/app/admin/modules',
    USERS: '/app/admin/users',
  },
} as const;
