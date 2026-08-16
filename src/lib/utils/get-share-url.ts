import { PATHS } from "@/lib/constants/paths";
import { getRootUrl } from "./get-root-url";

export function getShareUrl(joinCode: string): string {
  return `${getRootUrl()}${PATHS.PLAY("session", joinCode)}`;
}
