import { QueryConfig, MutationConfig } from './types.base'

export const API_REGISTRY = {
  sessions: {
    list: {
      url: '/sessions',
      method: 'GET',
    } as QueryConfig<any>,
    create: {
      url: '/sessions',
      method: 'POST',
    } as MutationConfig<any, any>,
  },
} as const
