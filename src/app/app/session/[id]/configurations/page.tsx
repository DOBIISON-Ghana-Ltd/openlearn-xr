import { getQueryClient } from "@/lib/utils/get-query-client";
import { prefetchApi } from "@/data/hooks/use-prefetch-api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
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

  const queryClient = getQueryClient();
  await prefetchApi(queryClient, "ses:session:get:overview", id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage sessionId={id} />
    </HydrationBoundary>
  );
}