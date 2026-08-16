import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export const metadata = {
  title: 'Teaching Sessions',
  description: 'Manage live 3D science lab sessions, view active and upcoming sessions, track student participation, and launch interactive labs.',
};

export default async function Page() {
  await connection();
  await verifyRouteGuard();

  return <ClientPage />;
}
