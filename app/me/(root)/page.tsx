import type { Metadata } from "next";
import ClientPage from "./client";

export const metadata: Metadata = {
  title: 'Dashboard | OpenLearn',
  description: 'Welcome to your OpenLearn dashboard. Access your active labs, hosted sessions, and explore new modules.',
}

export default async function Page() {
  return <ClientPage />;
}
