import { Metadata } from 'next'
import { connection } from "next/server";
import ClientPage from "./client";

export const metadata: Metadata = {
  title: 'Verify Email | OpenLearn',
  description: 'Verify your email address to complete your OpenLearn account registration.',
}

export default async function Page() {
  await connection();
  return <ClientPage />;
}