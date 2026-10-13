import type { Metadata } from "next";
import { connection } from 'next/server';
import ClientPage from "./client";

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Complete your profile setup to get started with OpenLearn interactive science labs.',
};

export default async function Page() {
  await connection();
  return <ClientPage />;
}
