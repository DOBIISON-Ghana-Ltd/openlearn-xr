import * as React from 'react';
import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/me/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { cookies } from 'next/headers';

export default async function MeLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  await prefetchApi(queryClient, 'public:user:get:me');

  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <AppSidebar />
        <SidebarInset>
          {/* Global top bar — consistent across all /me pages */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
