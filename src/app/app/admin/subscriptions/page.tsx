import { getQueryClient } from "@/lib/utils/get-query-client";
import { prefetchApi } from "@/data/hooks/use-prefetch-api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import ClientPage from "./client";

export default async function Page() {
  await connection();

  const queryClient = getQueryClient();
  await prefetchApi(queryClient, "admin:subscription:get:all");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
