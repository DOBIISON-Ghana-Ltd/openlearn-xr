import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { QueryConfig, MutationConfig, Infer } from "@/data/types.base";
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

// ---------------------------------------------------------------------------
// GET /api/editor/collections
// ---------------------------------------------------------------------------
const publicGetAllCollections = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:collection:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["public:collection:get:all"]()),
      ZModules.PublicCollectionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

// ---------------------------------------------------------------------------
// GET /api/editor/modules
// ---------------------------------------------------------------------------
const publicGetAllModules = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:module:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["public:module:get:all"]()),
      ZModules.PublicModuleGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

// ---------------------------------------------------------------------------
// POST /api/editor/collections
// ---------------------------------------------------------------------------
const publicCreateCollection = {
  type: "mutation",
  mutationFn: async (body: Infer["PublicCollectionCreate"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["public:collection:post:create"](), body),
      ZModules.PublicCollectionCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

// ---------------------------------------------------------------------------
// POST /api/editor/modules
// ---------------------------------------------------------------------------
const publicCreateModule = {
  type: "mutation",
  mutationFn: async (body: Infer["PublicModuleCreate"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["public:module:post:create"](), body),
      ZModules.PublicModuleCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const api = {
  "public:module-version:get:all": publicGetAllVersions,
  "public:module-completion:get:all": publicGetAllCompletions,
  "public:collection:get:all": publicGetAllCollections,
  "public:module:get:all": publicGetAllModules,
  "public:collection:post:create": publicCreateCollection,
  "public:module:post:create": publicCreateModule,
};

export default api;
