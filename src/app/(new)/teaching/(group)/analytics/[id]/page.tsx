import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';
import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const metadata = {
  title: 'Session Performance Analytics',
  description: 'Detailed analytics report for Forces & Motion session including attendance, completion rate, 5E progress, difficulty questions, and student leaderboard.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  await connection();
  await verifyRouteGuard();
  const { id } = await params;

  const queryClient = getQueryClient();
  await Promise.all([
    prefetchApi(queryClient, 'ses:analytics:get:info', { id }),
    prefetchApi(queryClient, 'ses:analytics:get:metrics', { id }),
    prefetchApi(queryClient, 'ses:analytics:get:players', { id }),
    prefetchApi(queryClient, 'ses:analytics:get:checkpoints', { id }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage id={id} />
    </HydrationBoundary>
  );
}
