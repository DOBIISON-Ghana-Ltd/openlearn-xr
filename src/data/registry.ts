import appApi from "./api/app/app.api";
import simApi from "./api/sim/sim.api";
import sesApi from "./api/ses/ses.api";
import editorApi from "./api/editor/editor.api";
import adminApi from "./api/admin/admin.api";

export const apiRegistry = {
  ...appApi,
  ...simApi,
  ...sesApi,
  ...editorApi,
  ...adminApi,
} as const;

export type ApiRegistry = typeof apiRegistry;

// Helper type to filter only Query keys for prefetching
export type QueryKeys = {
  [K in keyof ApiRegistry]: ApiRegistry[K] extends { type: "query" }
    ? K
    : never;
}[keyof ApiRegistry];
