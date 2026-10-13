import type { Metadata } from 'next';
import ClientPage from './client';

export const metadata: Metadata = {
  title: 'Session Waiting Room',
  description: 'Manage session participants in the Open Learn XR waiting room.',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return <ClientPage id={id} />;
}