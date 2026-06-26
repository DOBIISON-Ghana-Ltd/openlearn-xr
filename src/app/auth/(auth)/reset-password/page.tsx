import { Metadata } from 'next'
import ClientPage from "./client";
import { connection } from 'next/server';

export const metadata: Metadata = {
  title: 'Reset Password | OpenLearn',
  description: 'Enter your new password to secure your OpenLearn account.',
}


export default async function Page() {
  await connection();
  return <ClientPage />;
}
