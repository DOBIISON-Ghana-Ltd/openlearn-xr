import type { Metadata } from 'next';
import CreateSessionClient from './client';

export const metadata: Metadata = {
  title: 'Create Session | Open Learn XR',
  description: 'Create a new teaching session on Open Learn XR.',
};

export default function CreateSessionPage() {
  return <CreateSessionClient />;
}
