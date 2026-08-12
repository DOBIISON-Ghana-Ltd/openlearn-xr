import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export const metadata = {
  title: 'Session Performance Analytics',
  description: 'Detailed analytics report for Forces & Motion session including attendance, completion rate, 5E progress, difficulty questions, and student leaderboard.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  await connection();
  await verifyRouteGuard();
  const { id } = await params;

  return <ClientPage sessionId={id} />;
}
