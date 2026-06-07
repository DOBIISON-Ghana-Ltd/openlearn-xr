import { env } from "../config/env";


export default function getAbsoluteClientUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, env.NEXT_PUBLIC_APP_URL).toString();
}
