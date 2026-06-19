import { createSerializer, parseAsString, useQueryStates } from 'nuqs'
import type { inferParserType, UseQueryStatesKeysMap } from 'nuqs'
import { ROUTES } from "@/lib/constants/routes"

// --- Parser definitions ---
const paginationPage = {
  page: parseAsString.withDefault('1'),
}

const parsers = {
  resetPassword: {
    email: parseAsString.withDefault(''),
    otp: parseAsString.withDefault(''),
    redirect: parseAsString.withDefault(''),
  },
  verifyEmail: {
    email: parseAsString.withDefault(''),
    redirect: parseAsString.withDefault(''),
  },
  register: {
    redirect: parseAsString.withDefault(''),
  },
  login: {
    redirect: parseAsString.withDefault(''),
  },
  forgotPassword: {
    email: parseAsString.withDefault(''),
    redirect: parseAsString.withDefault(''),
  },
  verifyCache: {
    redirect: parseAsString.withDefault('')
  },
  onboarding: {
    redirect: parseAsString.withDefault(''),
  },
  modules: {
    q:    parseAsString.withDefault(''),
    page: parseAsString.withDefault('1'),
  },
  page: paginationPage
} as const

type ParsersMap = typeof parsers
type NuqsKey = keyof ParsersMap

// --- nuqs object ---

export const nuqs = {
  /**
   * useQueryStates wrapper — usage:
   *   const [state, setState] = nuqs.getStates('login', { history: 'push' })
   */
  getStates<K extends NuqsKey>(
    key: K,
    ...rest: Parameters<typeof useQueryStates<ParsersMap[K]>> extends [
      infer _Parsers,
      ...infer Options,
    ]
      ? Options
      : []
  ) {
    return useQueryStates(
      parsers[key] as UseQueryStatesKeysMap<ParsersMap[K]>,
      ...(rest as any),
    ) as ReturnType<typeof useQueryStates<ParsersMap[K]>>
  },

  /**
   * Serializes a URL with query params — usage:
   *   nuqs.getUrl('resetPassword', 'auth:reset-password', { email: '...', otp: '...' })
   */
  getUrl<K extends NuqsKey>(
    key: K,
    data: Partial<inferParserType<ParsersMap[K]>>,
    route?: string
  ): string {
    return createSerializer(parsers[key])(
      route || ROUTES.APP.DASHBOARD, 
      data as any
    )
  },
}