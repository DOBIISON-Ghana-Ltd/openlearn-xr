import { Suspense } from 'react';
import TeachingSettingsClient from './client';

export const metadata = {
  title: 'Teaching Settings — OpenLearnXR',
  description:
    'Manage profile details, teaching preferences, default lab subject filters, and account notification settings.',
};

export default function TeachingSettingsPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-surface-white" />}>
      <TeachingSettingsClient />
    </Suspense>
  );
}
