import useApi from "@/data/hooks/use-api";

export type IPlayMode = "module" | "session";
export type IServerMode = "module:local" | "module:remote" | "session";

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
  const serverMode: IServerMode = isAuthenticated ? "module:remote" : "module:local";

  return { serverMode, isLoading };
}
