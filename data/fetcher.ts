import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { api } from './axios'

export interface FetcherOptions<TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  config: AxiosRequestConfig
  schema?: TSchema
}

export async function fetcher<TSchema extends z.ZodTypeAny = z.ZodTypeAny>({
  config,
  schema,
}: FetcherOptions<TSchema>): Promise<z.infer<TSchema>> {
  const response = await api.request(config)
  const payload = response.data
  const responseData = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload

  if (schema) {
    return schema.parse(responseData)
  }

  return responseData
}
