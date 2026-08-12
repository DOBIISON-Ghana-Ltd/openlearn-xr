import { Metadata } from 'next';
import { connection } from 'next/server';
import ClientPage from './client';
import { verifyRouteGuard } from '@/lib/utils/route-guard';

export const metadata: Metadata = {
  title: 'Session Waiting Room',
  description: 'Manage session participants in the Open Learn XR waiting room.',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  await connection();
  await verifyRouteGuard();
  const { id } = await props.params;

  return <ClientPage id={id} />;
}