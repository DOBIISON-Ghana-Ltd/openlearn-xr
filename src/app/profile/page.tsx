import { Metadata } from 'next'
import { connection } from "next/server";
import ClientPage from "./client";
import { verifyRouteGuard } from '@/lib/utils/route-guard';
import { prefetchApi } from '@/data/hooks/use-prefetch-api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Footer from '@/components/common/footer';
import Header from "@/components/common/header";

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and manage your OpenLearn XR profile, settings, and learning statistics.',
}

export default async function Page() {
  await connection();
  await verifyRouteGuard();
  const queryClient = getQueryClient();
  await Promise.all([
    prefetchApi(queryClient, 'app:user:get:me'),
    prefetchApi(queryClient, 'app:user:get:profile'),
    prefetchApi(queryClient, 'app:user:get:profile-stats'),
    prefetchApi(queryClient, 'app:user:get:profile-subscription'),
    prefetchApi(queryClient, 'app:user:get:profile-history'),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen flex-col bg-surface-white">
        <Header />
        <ClientPage />
        <Footer />
      </div>
    </HydrationBoundary>
  );
}