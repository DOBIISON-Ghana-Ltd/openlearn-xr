import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PlayClient from './client';
import { verifyPlayRouteParams } from '@/lib/utils/verify-play-route-params';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = verifyPlayRouteParams(slug);

  if (!result.isCorrect) {
    return { title: 'Not Found' };
  }

  const { mode, id } = result.data;
  return {
    title: `Play ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
    description: `Play environment for ${mode}${id ? ` ${id}` : ''}`,
  };
}

export default async function PlayPage({ params }: Props) {
  const { slug } = await params;
  const result = verifyPlayRouteParams(slug);

  if (!result.isCorrect) {
    notFound();
  }

  const { mode, id } = result.data;

  return <PlayClient mode={mode} id={id} />;
}
