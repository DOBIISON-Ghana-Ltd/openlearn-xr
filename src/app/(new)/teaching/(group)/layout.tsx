import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Header from '@/components/(new)/common/header';
import { TeachingSidebar } from './sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  await prefetchApi(queryClient, 'app:user:get:me');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen flex-col bg-surface-white">
        <Header />
        <div className="mx-auto w-full max-w-8xl flex flex-col md:flex-row flex-1 min-h-[calc(100dvh-var(--spacing)*20)]">
          <TeachingSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </HydrationBoundary>
  );
}

