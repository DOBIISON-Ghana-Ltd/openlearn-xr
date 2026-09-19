import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export const metadata = {
  title: 'Teaching Library',
  description:
    'Browse curriculum-aligned SHS science lab modules, search by topic, and filter by subject or year group.',
};

export default async function Page() {
  await connection();
  await verifyRouteGuard();

  return <ClientPage />;
}
