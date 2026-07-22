export const PATHS = {
  // MARKETING ROUTES
  HOME: '/',
  LICENSING: '/licensing',
  CONTACT: '/contact',
  LEGAL: {
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
    COOKIES: '/legal/cookies',
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
      ONE: (id: string) => `/app/library/${id}`,
    },
    MODULES: '/app/modules',
    PLAY: (mode: string, id?: string) => `/app/play/${mode}/${id}`,
    JOIN: '/app/join',
  },

  // EDITOR SUITE
  EDITOR: {
    DASHBOARD: '/app/editor',
    ONE: (id: string) => `/app/editor/${id}`,
    COLLECTIONS: {
      ROOT: '/app/editor/collections',
      ONE: (id: string) => `/app/editor/collections/${id}`,
    },
  },

  // SESSION SUITE
  SESSION: {
    DASHBOARD: '/app/session',
    ONE: {
      ROOT: (id: string) => `/app/session/${id}`,
      LEADERBOARD: (id: string) => `/app/session/${id}/leaderboard`,
      ANALYTICS: (id: string) => `/app/session/${id}/analytics`,
      CONFIGURATIONS: (id: string) => `/app/session/${id}/configurations`,
      SETTINGS: (id: string) => `/app/session/${id}/settings`,
    },
  },

  // ADMIN SUITE
  ADMIN: {
    DASHBOARD: '/app/admin',
    ANALYTICS: '/app/admin/analytics',
    USERS: '/app/admin/users',
    SUBSCRIPTIONS: '/app/admin/subscriptions',
    EMAIL: '/app/admin/email',
  },
} as const;
