import { Metadata } from "next";
import ClientPage from "./client";
import { connection } from 'next/server';

export const metadata: Metadata = {
  title: 'Register | OpenLearn',
  description: 'Create an OpenLearn account and start learning with interactive 3D science labs.',
}

export default async function Page() {
  await connection();
  return <ClientPage />;
}
