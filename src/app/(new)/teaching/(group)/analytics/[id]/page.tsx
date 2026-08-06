import { Suspense } from 'react';
import AnalyticsDetailClient from './client';

export const metadata = {
  title: 'Session Performance Analytics — OpenLearnXR',
  description:
    'Detailed analytics report for Forces & Motion session including attendance, completion rate, 5E progress, difficulty questions, and student leaderboard.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalyticsDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
      <AnalyticsDetailClient sessionId={id} />
    </Suspense>
  );
}
