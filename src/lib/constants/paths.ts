export const PATHS = {
  // MARKETING ROUTES
  HOME: '/',
  MODULES: '/modules',
  PLAY: (mode: string, id?: string) => id ? `/p/${mode}/${id}` : `/p/${mode}`,
  LICENSING: '/licensing',
  CONTACT: '/contact',
  LEGAL: {
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
    COOKIES: '/legal/cookies',
  },

  // TEACHING SUITE
  TEACHING: {
    ROOT: '/teaching',
    ANALYTICS: {
      HOME: '/teaching/analytics',
      DETAIL: (id: string) => `/teaching/analytics/${id}`,
    },
    LIBRARY: '/teaching/library',
    RESOURCES: '/teaching/resources',
    SESSIONS: {
      ROOT: '/teaching/sessions',
      CREATE: '/teaching/sessions/create',
      DETAIL: (id: string) => `/teaching/sessions/${id}`,
    },
    SETTINGS: '/teaching/settings',
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

  // ADMIN SUITE
  ADMIN: {
    DASHBOARD: '/app/admin',
    ANALYTICS: '/app/admin/analytics',
    USERS: '/app/admin/users',
    SUBSCRIPTIONS: '/app/admin/subscriptions',
    EMAIL: '/app/admin/email',
  },
} as const;
