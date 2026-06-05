import { API_REGISTRY } from '../../registry'
import { sessionSchema, sessionListResponseSchema } from './session.schema'
import { QueryConfig, MutationConfig } from '../../types.base'

export const SESSION_API = {
  list: {
    ...API_REGISTRY.sessions.list,
    schema: sessionListResponseSchema,
  } as QueryConfig<any>,
  create: {
    ...API_REGISTRY.sessions.create,
    schema: sessionSchema,
  } as MutationConfig<any, any>,
} as const
