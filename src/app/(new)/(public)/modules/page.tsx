import { Suspense } from 'react';
import ModulesClient from './client';

export const metadata = {
  title: 'Science Curriculum Modules — OpenLearnXR',
  description:
    'Browse GES-aligned high school science modules across Chemistry, Physics, and Engineering for SHS Year 1, Year 2, and Year 3. Track progress and launch 3D interactive simulations.',
};

export default function ModulesPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-surface-white" />}>
      <ModulesClient />
    </Suspense>
  );
}

