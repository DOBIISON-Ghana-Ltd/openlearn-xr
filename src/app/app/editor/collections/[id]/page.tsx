import { connection } from "next/server";
import ClientPage from "./client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  await connection();

  return (<ClientPage collectionId={id} />);
}