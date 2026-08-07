import { Suspense } from 'react';
import TeachingResourcesClient from './client';

export const metadata = {
  title: 'Teaching Resources — OpenLearnXR',
  description:
    'Access 3D model assets, teaching guides, lab curriculum documents, and Unity simulation packages.',
};

export default function TeachingResourcesPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-surface-white" />}>
      <TeachingResourcesClient />
    </Suspense>
  );
}
