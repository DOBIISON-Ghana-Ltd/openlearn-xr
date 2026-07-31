import { getQueryClient } from "@/lib/utils/get-query-client";
import Navigation from "./navigation";
import SessionNotes from "./session-notes";
import { connection } from "next/server";
import { prefetchApi } from "@/data/hooks/use-prefetch-api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface LayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode
}

export default async function Layout(props: LayoutProps) {
  const { params, children } = props;
  const { id } = await params;
  await connection();

  const queryClient = getQueryClient();
  await prefetchApi(queryClient, "ses:session:get:overview", { id });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Navigation />
      <div className="flex-1">
        {children}
      </div>
      <SessionNotes />
    </HydrationBoundary>
  )
}