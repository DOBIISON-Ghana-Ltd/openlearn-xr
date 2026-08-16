import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Header from '@/components/(new)/common/header';
import { HeaderSearch } from '@/components/(new)/common/header-search';
import Footer from '@/components/(new)/common/footer';
import { connection } from 'next/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await connection();
  const queryClient = getQueryClient();
  await prefetchApi(queryClient, 'app:user:get:me');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen flex-col bg-surface-white">
        <Header>
          <HeaderSearch />
        </Header>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </HydrationBoundary>
  );
}

