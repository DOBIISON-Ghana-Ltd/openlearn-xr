import type { Metadata } from 'next';
import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export const metadata: Metadata = {
  title: 'Create Session',
  description: 'Create a new teaching session on Open Learn XR.',
};

export default async function Page() {
  await connection();
  await verifyRouteGuard();

  return <ClientPage />;
}
