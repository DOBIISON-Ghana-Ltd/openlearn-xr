import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Layout({ children }: { children: React.ReactNode }) {

  const queryClient = getQueryClient();
  await prefetchApi(queryClient, 'public:user:get:me');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
