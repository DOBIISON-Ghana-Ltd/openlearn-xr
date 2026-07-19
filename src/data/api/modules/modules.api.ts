import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { QueryConfig } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZModules from "./modules.schema";

// ---------------------------------------------------------------------------
// GET /api/modules/versions
// ---------------------------------------------------------------------------
const publicGetAllVersions = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:module-version:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["public:module-version:get:all"]()),
      ZModules.PublicModuleVersionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

// ---------------------------------------------------------------------------
// GET /api/modules/completions
// ---------------------------------------------------------------------------
const publicGetAllCompletions = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:module-completion:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["public:module-completion:get:all"]()),
      ZModules.PublicModuleCompletionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const api = {
  "public:module-version:get:all": publicGetAllVersions,
  "public:module-completion:get:all": publicGetAllCompletions,
};

export default api;
