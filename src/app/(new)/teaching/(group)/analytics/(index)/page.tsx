import { Suspense } from 'react';
import AnalyticsClient from './client';

export const metadata = {
  title: 'Teaching Analytics — OpenLearnXR',
  description:
    'Track student engagement, view performance analytics for past lab sessions, and analyze class metrics.',
};

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-surface-white" />}>
      <AnalyticsClient />
    </Suspense>
  );
}
