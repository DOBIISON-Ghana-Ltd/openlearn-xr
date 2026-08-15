import Pusher from "pusher";
import { env } from "@/lib/config/env";
import { RealtimeEventMap, RealtimeEventName } from "./types";

let pusherServerInstance: Pusher | null = null;

/**
 * Returns the global Pusher server instance configured via environment variables.
 * Can trigger events on standard Pusher or self-hosted Pusher-compatible services (Soketi, Reverb, etc.)
 */
export const getPusherServer = (): Pusher => {
  if (pusherServerInstance) return pusherServerInstance;

  const appId = env.PUSHER_APP_ID;
  const key = env.PUSHER_KEY || env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = env.PUSHER_SECRET;

  if (!appId || !key || !secret) {
    throw new Error("Missing Pusher server configurations (appId, key, or secret) in environment variables.");
  }

  const host = env.NEXT_PUBLIC_PUSHER_HOST;
  const portStr = env.NEXT_PUBLIC_PUSHER_PORT;
  const forceTlsStr = env.NEXT_PUBLIC_PUSHER_FORCE_TLS;

  const useTLS = forceTlsStr ? forceTlsStr === "true" : true;

  const config: Pusher.Options = host
    ? {
      appId,
      key,
      secret,
      host,
      port: portStr || undefined,
      useTLS,
    }
    : {
      appId,
      key,
      secret,
      cluster: env.PUSHER_CLUSTER || "mt1",
      useTLS,
    };

  pusherServerInstance = new Pusher(config);
  return pusherServerInstance;
};

/**
 * Strongly-typed event trigger (broadcast) helper for server-side routes.
 */
export const triggerEvent = async <E extends RealtimeEventName>(
  channelName: string,
  event: E,
  data: RealtimeEventMap[E]
) => {
  const pusher = getPusherServer();
  await pusher.trigger(channelName, event, data);
};

/**
 * Session-specific trigger helper that automatically prepends `session-` prefix.
 */
export const triggerSessionEvent = async <E extends RealtimeEventName>(
  joinCode: string,
  event: E,
  data: RealtimeEventMap[E]
) => {
  await triggerEvent(`session-${joinCode}`, event, data);
};
