import type { Metadata } from 'next';
import { connection } from 'next/server';
import ClientPage from './client';

export const metadata: Metadata = {
  title: 'Onboarding | OpenLearn',
  description: 'Complete your profile setup to start exploring OpenLearn.',
};

export default async function Page() {
  await connection();
  return <ClientPage />;
}
