import useApi from "@/data/hooks/use-api";
import { ServerMode } from "@/data/schema.base";

export type IPlayMode = "module" | "session";
export type IServerMode = ServerMode;

export function usePlayServerMode(flowMode: IPlayMode): {
  serverMode: IServerMode;
  isLoading: boolean;
} {
  const isSession = flowMode === "session";

  // Skip user lookup if flowMode is "session"
  const { data: me, isLoading } = useApi.query("app:user:get:me", undefined, !isSession);

  if (isSession) {
    return { serverMode: "session", isLoading: false };
  }

  const isAuthenticated = Boolean(me && "id" in me && me.id);
  const serverMode: IServerMode = isAuthenticated ? "remote" : "local";

  return { serverMode, isLoading };
}
