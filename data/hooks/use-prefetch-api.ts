import { QueryClient } from '@tanstack/react-query';
import { apiRegistry, ApiRegistry, QueryKeys } from '@/data/registry';

/**
 * Server-side helper to prefetch data for React Query hydration.
 * usage:
 * await prefetchApi(queryClient, 'get:users:me', undefined);
 */
export async function prefetchApi<K extends QueryKeys>(
  queryClient: QueryClient,
  key: K,
  vars?: ApiRegistry[K] extends { type: 'query' } 
    ? Parameters<ApiRegistry[K]['queryFn']>[0] 
    : never
) {
  const config = apiRegistry[key] as any;

  await queryClient.prefetchQuery({
    queryKey: config.queryKey(vars),
    queryFn: () => config.queryFn(vars),
    ...config.options,
  });
}
