export const ROUTES = {
  // MARKETING ROUTES
  HOME: '/',
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
    DASHBOARD: '/app',
    MODULES: '/app/modules',
    SESSIONS: '/app/sessions',
    COMMUNITY: '/app/community',
    HISTORY: '/app/history',
    PLAY: (type: string, id: string) => `/play/${type}/${id}`,
  },

  // ADMIN ROUTES
  ADMIN: {
    DASHBOARD: '/admin',
    MODULES: '/admin/modules',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
  },
} as const ;
