import { Suspense } from 'react';
import SessionsClient from './client';

export const metadata = {
  title: 'Teaching Sessions',
  description: 'Manage live 3D science lab sessions, view active and upcoming sessions, track student participation, and launch interactive labs.',
};

export default function SessionsPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-surface-white" />}>
      <SessionsClient />
    </Suspense>
  );
}
