import { Suspense } from 'react';
import TeachingDashboardClient from './client';

export const metadata = {
  title: 'Teacher Dashboard',
  description:
    'Manage live 3D science lab sessions, track student engagement stats, view schedules, and launch curriculum-aligned SHS simulations.',
};

export default function TeachingDashboardPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-surface-white" />}>
      <TeachingDashboardClient />
    </Suspense>
  );
}
