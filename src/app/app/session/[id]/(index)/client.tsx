"use client";

import { match } from "ts-pattern";
import Cancelled from "./cancelled";
import Content from "./content";
import Lobby from "./lobby";
import useApi from "@/data/hooks/use-api";

interface ClientPageProps {
  sessionId: string;
}

export default function ClientPage({ sessionId }: ClientPageProps) {
  const { data: session } = useApi.query("public:session:get:overview", sessionId);

  return (
    <div className="size-full space-y-5 pb-7">
      <div className="w-full py-5 px-6 ">
        <h1 className="text-xl font-semibold text-foreground">
          {session?.name || 'Live Session'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <span className="font-medium text-foreground">
            {session?.moduleVersion.module.title || 'Loading Module...'}
          </span>
          <span>•</span>
          <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            v{session?.moduleVersion.versionNumber ?? ''}
          </span>
        </p>
      </div>
      {match(session?.status || 'STAGING')
        .with('STAGING', () => <Lobby />)
        .with('CANCELLED', () => <Cancelled />)
        .otherwise(() => <Content />)
      }
    </div>
  )
}