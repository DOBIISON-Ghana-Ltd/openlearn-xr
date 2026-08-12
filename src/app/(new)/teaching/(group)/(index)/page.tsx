import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export const metadata = {
  title: 'Teacher Dashboard',
  description:
    'Manage live 3D science lab sessions, track student engagement stats, view schedules, and launch curriculum-aligned SHS simulations.',
};

export default async function Page() {
  await connection();
  await verifyRouteGuard();

  return <ClientPage />;
}
