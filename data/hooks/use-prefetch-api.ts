import { QueryClient } from '@tanstack/react-query'
import { fetcher } from '../fetcher'
import { QueryConfig } from '../types.base'

export async function prefetchApiQuery<TResponse, TParams = undefined>(
  queryClient: QueryClient,
  config: QueryConfig<TResponse, TParams>,
  params?: TParams
) {
  const url = typeof config.url === 'function' ? config.url(params as TParams) : config.url

  await queryClient.prefetchQuery({
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
  })
}
