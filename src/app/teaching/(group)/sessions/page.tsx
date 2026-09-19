import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';
import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const metadata = {
  title: 'Teaching Sessions',
  description: 'Manage live 3D science lab sessions, view active and upcoming sessions, track student participation, and launch interactive labs.',
};

export default async function Page() {
  await connection();
  await verifyRouteGuard();

  const queryClient = getQueryClient();
  await prefetchApi(queryClient, 'ses:session:get:all', {
    status: ['ACTIVE', 'STAGING'],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
