import { connection } from "next/server";
import Content from "./content";
import Documents from "./documents";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  await connection();

  return (
    <>
      <Content collectionId={id} />
      <Documents collectionId={id} />
    </>
  );
}