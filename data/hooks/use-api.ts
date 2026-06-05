import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { fetcher } from '../fetcher'
import { QueryConfig, MutationConfig } from '../types.base'

export function useApiQuery<TResponse, TParams = undefined>(
  config: QueryConfig<TResponse, TParams>,
  params?: TParams,
  options?: Omit<UseQueryOptions<TResponse, Error>, 'queryKey' | 'queryFn'>
) {
  const url = typeof config.url === 'function' ? config.url(params as TParams) : config.url

  return useQuery<TResponse, Error>({
    queryKey: [url, params],
    queryFn: () =>
      fetcher<any>({
        config: {
          url,
          method: config.method || 'GET',
          params: config.method === 'GET' ? params : undefined,
        },
        schema: config.schema,
      }),
    ...options,
  })
}

export function useApiMutation<TResponse, TBody = undefined, TParams = undefined>(
  config: MutationConfig<TResponse, TBody, TParams>,
  options?: UseMutationOptions<TResponse, Error, { body: TBody; params?: TParams }>
) {
  return useMutation<TResponse, Error, { body: TBody; params?: TParams }>({
    mutationFn: ({ body, params }) => {
      const url = typeof config.url === 'function' ? config.url(params as TParams) : config.url
      return fetcher<any>({
        config: {
          url,
          method: config.method,
          data: body,
        },
        schema: config.schema,
      })
    },
    ...options,
  })
}
