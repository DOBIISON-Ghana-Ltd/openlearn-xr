import { Metadata } from 'next'
import { connection } from 'next/server';
import ClientPage from "./client";

export const metadata: Metadata = {
  title: 'Forgot Password | OpenLearn',
  description: 'Enter your email address to reset your OpenLearn account password.',
}

export default async function Page() {
  await connection();
  return <ClientPage />;
}
