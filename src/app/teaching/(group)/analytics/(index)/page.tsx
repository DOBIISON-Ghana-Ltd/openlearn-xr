import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';
import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const metadata = {
  title: 'Teaching Analytics',
  description: 'Track student engagement, view performance analytics for past lab sessions, and analyze class metrics.',
};

export default async function Page() {
  await connection();
  await verifyRouteGuard();

  const queryClient = getQueryClient();
  await Promise.all([
    prefetchApi(queryClient, 'ses:session:get:stats'),
    prefetchApi(queryClient, 'ses:analytics:get:all'),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
