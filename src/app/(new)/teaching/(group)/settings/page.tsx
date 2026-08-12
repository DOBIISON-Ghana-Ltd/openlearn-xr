import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export const metadata = {
  title: 'Teaching Settings',
  description: 'Manage profile details, teaching preferences, default lab subject filters, and account notification settings.',
};

export default async function Page() {
  await connection();
  await verifyRouteGuard();

  return <ClientPage />;
}
