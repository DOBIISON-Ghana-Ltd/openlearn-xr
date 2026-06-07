import type { Metadata } from "next";
import { connection } from 'next/server';
import ClientPage from "./client";

export const metadata: Metadata = {
  title: 'Login | OpenLearn',
  description: 'Login to your OpenLearn account to access your labs and dashboard.',
}

export default async function Page() {
  await connection();
  return <ClientPage />;
}
