import { PATHS } from "@/lib/constants/paths";
import { getRootUrl } from "./get-root-url";
import { nuqs } from "./nuqs";

export function getShareUrl(sessionId: string, code?: string): string {
  const path = PATHS.SIMS.PLAY("session", sessionId);
  if (code) {
    return `${getRootUrl()}${nuqs.getUrl("sim:play", { code }, path)}`;
  }
  return `${getRootUrl()}${path}`;
}
