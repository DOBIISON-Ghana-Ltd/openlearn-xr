export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  ONBOARDING: '/onboarding',
  APP: {
    DASHBOARD: '/app',
    MODULES: '/app/modules',
    SESSIONS: '/app/sessions',
    COMMUNITY: '/app/community',
    MY_PLAYS: '/app/my-plays',
    PLAY: (type: string, id: string) => `/play/${type}/${id}`,
  },
  ADMIN: {
    DASHBOARD: '/admin',
    MODULES: '/admin/modules',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
  },
} as const
