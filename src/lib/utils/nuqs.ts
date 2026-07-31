import { createSerializer, parseAsString, useQueryStates } from 'nuqs'
import type { inferParserType, UseQueryStatesKeysMap } from 'nuqs'
import { PATHS } from "@/lib/constants/paths"

// --- Parser definitions ---
const paginationPage = {
  page: parseAsString.withDefault('1'),
}

const parsers = {
  // APP SUITE (Auth, Onboarding, Core App)
  "app:login": {
    redirect: parseAsString.withDefault(''),
  },
  "app:register": {
    redirect: parseAsString.withDefault(''),
  },
  "app:forgot-password": {
    email: parseAsString.withDefault(''),
    redirect: parseAsString.withDefault(''),
  },
  "app:reset-password": {
    email: parseAsString.withDefault(''),
    otp: parseAsString.withDefault(''),
    redirect: parseAsString.withDefault(''),
  },
  "app:verify-email": {
    email: parseAsString.withDefault(''),
    redirect: parseAsString.withDefault(''),
  },
  "app:onboarding": {
    redirect: parseAsString.withDefault(''),
  },
  "app:verify-cache": {
    redirect: parseAsString.withDefault(''),
  },

  // SIM SUITE (Simulation Dashboard & Library)
  "sim:modules": {
    search: parseAsString.withDefault(''),
    status: parseAsString.withDefault('all'),
    subject: parseAsString.withDefault('all'),
    grade: parseAsString.withDefault('all'),
  },
  "sim:library": {
    collectionId: parseAsString.withDefault(''),
  },
  "sim:play": {
    code: parseAsString.withDefault(''),
  },

  // SES SUITE (Live Sessions & Multiplayer)
  "ses:dashboard": {
    new: parseAsString.withDefault('false'),
    moduleId: parseAsString.withDefault(''),
  },

  // EDITOR SUITE (Interactive Lab Studio)
  "editor:home": {
    q: parseAsString.withDefault(''),
  },

  // ADMIN SUITE (Admin Console)
  "admin:home": {
    q: parseAsString.withDefault(''),
  },

  page: paginationPage,
} as const

type ParsersMap = typeof parsers
type NuqsKey = keyof ParsersMap

// --- nuqs object ---

export const nuqs = {
  /**
   * useQueryStates wrapper — usage:
   *   const [state, setState] = nuqs.getStates('app:login', { history: 'push' })
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
   *   nuqs.getUrl('app:reset-password', { email: '...', otp: '...' }, '/auth/reset-password')
   */
  getUrl<K extends NuqsKey>(
    key: K,
    data: Partial<inferParserType<ParsersMap[K]>>,
    route?: string
  ): string {
    return createSerializer(parsers[key])(
      route || PATHS.SIMS.DASHBOARD, 
      data as any
    )
  },
}