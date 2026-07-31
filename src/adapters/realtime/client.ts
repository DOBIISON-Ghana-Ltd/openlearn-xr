import Pusher, { Options } from "pusher-js";
import { env } from "@/lib/config/env";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RealtimeEventMap, RealtimeEventName } from "./types";
export type { RealtimeEventMap, RealtimeEventName };

let pusherInstance: Pusher | null = null;

const getPusher = (): Pusher => {
  if (typeof window === "undefined") {
    throw new Error("Pusher client should only be instantiated on the client-side.");
  }
  if (pusherInstance) return pusherInstance;

  const key = env.NEXT_PUBLIC_PUSHER_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_PUSHER_KEY in environment variables.");
  }

  const options: Options = {
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
  };

  if (env.NEXT_PUBLIC_PUSHER_HOST) {
    options.wsHost = env.NEXT_PUBLIC_PUSHER_HOST;
    options.httpHost = env.NEXT_PUBLIC_PUSHER_HOST;
  }

  if (env.NEXT_PUBLIC_PUSHER_PORT) {
    const port = parseInt(env.NEXT_PUBLIC_PUSHER_PORT, 10);
    options.wsPort = port;
    options.wssPort = port;
  }

  if (env.NEXT_PUBLIC_PUSHER_FORCE_TLS) {
    options.forceTLS = env.NEXT_PUBLIC_PUSHER_FORCE_TLS === "true";
  }

  pusherInstance = new Pusher(key, options);
  return pusherInstance;
};

export class RealtimeClient {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Subscribes to a session channel (`session-${sessionId}`) and binds a dictionary of event listeners.
   * If a callback returns a query key array, the queryClient will invalidate that key automatically.
   */
  public subscribe(
    sessionId: string,
    events: {
      [K in RealtimeEventName]?: (data: RealtimeEventMap[K]) => readonly unknown[] | void;
    }
  ) {
    const pusher = getPusher();
    const channelName = `session-${sessionId}`;
    const channel = pusher.subscribe(channelName);

    (Object.keys(events) as RealtimeEventName[]).forEach((eventName) => {
      const handler = events[eventName];
      if (!handler) return;

      channel.bind(eventName, (data: any) => {
        const result = handler(data);
        if (Array.isArray(result)) {
          this.queryClient.invalidateQueries({ queryKey: result });
        }
      });
    });

    return {
      unbind: () => {
        (Object.keys(events) as RealtimeEventName[]).forEach((eventName) => {
          if (events[eventName]) {
            channel.unbind(eventName);
          }
        });
      },
      unsubscribe: () => {
        pusher.unsubscribe(channelName);
      }
    };
  }
}

/**
 * Custom React hook to instantiate and retrieve the RealtimeClient.
 */
export const useRealtime = () => {
  const queryClient = useQueryClient();
  const [realtime] = useState(() => new RealtimeClient(queryClient));
  return realtime;
};
