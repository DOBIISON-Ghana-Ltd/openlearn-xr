import { getQueryClient } from "@/lib/utils/get-query-client";
import { prefetchApi } from "@/data/hooks/use-prefetch-api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import ClientPage, { type IClientPage } from "./client";

interface PageProps {
  params: Promise<IClientPage>;
}

export default async function Page({ params }: PageProps) {
  const { mode, id } = await params;
  await connection();

  const queryClient = getQueryClient();

  if (mode === "session") {
    await prefetchApi(queryClient, "sim:session:get:stats", { id });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage mode={mode} id={id} />
    </HydrationBoundary>
  );
}