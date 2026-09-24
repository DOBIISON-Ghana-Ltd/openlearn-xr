import { connection } from 'next/server';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await connection();
  await verifyRouteGuard();
  return <>{children}</>;
}
