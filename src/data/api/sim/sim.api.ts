import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { Infer, QueryConfig } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZSim from "./sim.schema";

const simModuleGetAll = {
  type: "query",
  queryKey: (query?: Infer["SimModuleGetAll"]["query"]) => [...QUERY_KEYS["sim:module:get:all"](query)],
  queryFn: async (query?: Infer["SimModuleGetAll"]["query"]) => {
    const data = await fetcher(
      () => axios.get(R["sim:module:get:all"](), { params: query }),
      ZSim.SimModuleGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simModuleCompletionGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["sim:module-completion:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["sim:module-completion:get:all"]()),
      ZSim.SimModuleCompletionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simModuleVersionGetOptions = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["sim:module-version:get:options"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["sim:module-version:get:options"]()),
      ZSim.SimModuleVersionGetOptions.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simCollectionGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["sim:collection:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["sim:collection:get:all"]()),
      ZSim.SimCollectionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simCollectionGetModules = {
  type: "query",
  queryKey: (params: Infer["SimCollectionGetModules"]["params"]) => [...QUERY_KEYS["sim:collection:get:modules"](params.collectionId)],
  queryFn: async (params: Infer["SimCollectionGetModules"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["sim:collection:get:modules"](params)),
      ZSim.SimCollectionGetModules.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

export default {
  "sim:module:get:all": simModuleGetAll,
  "sim:module-completion:get:all": simModuleCompletionGetAll,
  "sim:module-version:get:options": simModuleVersionGetOptions,
  "sim:collection:get:all": simCollectionGetAll,
  "sim:collection:get:modules": simCollectionGetModules,
};
