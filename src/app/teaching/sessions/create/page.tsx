import type { Metadata } from 'next';
import ClientPage from './client';

export const metadata: Metadata = {
  title: 'Create Session',
  description: 'Create a new teaching session on Open Learn XR.',
};

export default async function Page() {

  return <ClientPage />;
}
