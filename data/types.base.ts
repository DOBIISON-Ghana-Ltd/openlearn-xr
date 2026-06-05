import { z } from 'zod'

export interface QueryConfig<TResponse, TParams = undefined> {
  url: string | ((params: TParams) => string)
  method?: 'GET'
  schema?: z.ZodType<TResponse>
}

export interface MutationConfig<TResponse, TBody = undefined, TParams = undefined> {
  url: string | ((params: TParams) => string)
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  schema?: z.ZodType<TResponse>
}
