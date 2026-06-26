import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Header from './header';
import Footer from './footer';
import Navigation from './navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {

  const queryClient = getQueryClient();
  await prefetchApi(queryClient, 'public:user:get:me');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="relative w-full min-h-dvh flex flex-col">
        <Header />
        <main className="relative flex-1 flex">
          <Navigation />
          <div className="flex-1 flex">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </HydrationBoundary>
  )
}