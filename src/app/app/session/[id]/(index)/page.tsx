import { getQueryClient } from "@/lib/utils/get-query-client";
import { prefetchApi } from "@/data/hooks/use-prefetch-api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import ClientPage, { type IClientPage } from "./client";

interface PageProps {
  params: Promise<IClientPage>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  await connection();

  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage id={id} />
    </HydrationBoundary>
  );
}