import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import ClientPage from './client';
import { verifyPlayRouteParams } from '@/lib/utils/verify-play-route-params';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export const metadata: Metadata = {
  title: 'Play Environment',
  description: 'Interactive science lab simulation and session player.',
};

export default async function Page({ params }: Props) {
  await connection();

  const { slug } = await params;
  const result = verifyPlayRouteParams(slug);

  if (!result.isCorrect) {
    notFound();
  }

  const { mode, id } = result.data;

  return <ClientPage mode={mode} id={id} />;
}
