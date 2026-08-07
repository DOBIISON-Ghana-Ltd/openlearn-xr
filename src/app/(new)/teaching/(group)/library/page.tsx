import { Suspense } from 'react';
import TeachingLibraryClient from './client';

export const metadata = {
  title: 'Teaching Library — OpenLearnXR',
  description:
    'Browse curriculum-aligned SHS science lab modules, search by topic, and filter by subject or year group.',
};

export default function TeachingLibraryPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-surface-white" />}>
      <TeachingLibraryClient />
    </Suspense>
  );
}
