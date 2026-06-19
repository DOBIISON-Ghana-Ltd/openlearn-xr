export const ROUTES = {
  // MARKETING ROUTES
  HOME: '/',
  LIBRARY: {
    ROOT: '/library',
    ONE: (id: string) => `/library/${id}`
  },

  MODULES: '/modules',

  LICENSING: '/licensing',
  CONTACT: '/contact',
  PLAY: (mode: string, id?: string) => `/play/${mode}/${id}`,
  LEGAL: {
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
    COOKIES: '/legal/cookies'
  },

  // AUTH ROUTES
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  ONBOARDING: '/onboarding',

  // APP ROUTES
  APP: {
    DASHBOARD: '/me',
    MY_PLAYS: '/me/my-plays',
    EDITOR: '/me/editor',
    SESSIONS: '/me/sessions',
    LICENSE: '/me/license',
  },

  // ADMIN ROUTES
  ADMIN: {
    DASHBOARD: '/admin',
    ANALYTICS: '/admin/analytics',
    MODULES: '/admin/modules',
    USERS: '/admin/users',
  },
} as const;
