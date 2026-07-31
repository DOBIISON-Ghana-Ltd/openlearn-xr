import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { Infer, QueryConfig, MutationConfig } from "@/data/types.base";
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

const simSessionGetStats = {
  type: "query",
  queryKey: (params: Infer["SimSessionGetStats"]["params"]) => [...QUERY_KEYS["sim:session:get:stats"](params.id)],
  queryFn: async (params: Infer["SimSessionGetStats"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["sim:session:get:stats"](params)),
      ZSim.SimSessionGetStats.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simSessionGetPlayers = {
  type: "query",
  queryKey: (params: Infer["SimSessionGetPlayers"]["params"]) => [...QUERY_KEYS["sim:session:get:players"](params.id)],
  queryFn: async (params: Infer["SimSessionGetPlayers"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["sim:session:get:players"](params)),
      ZSim.SimSessionGetPlayers.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simModuleGetStats = {
  type: "query",
  queryKey: (params: Infer["SimModuleGetStats"]["params"]) => [...QUERY_KEYS["sim:module:get:stats"](params.id)],
  queryFn: async (params: Infer["SimModuleGetStats"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["sim:module:get:stats"](params)),
      ZSim.SimModuleGetStats.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simSessionPostJoin = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimSessionPostJoin"], "params" | "body">) => {
    const data = await fetcher(
      () => axios.post(R["sim:session:post:join"]({ id: vars.params.id }), vars.body),
      ZSim.SimSessionPostJoin.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simSessionPostLeave = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimSessionPostLeave"], "params" | "body">) => {
    const data = await fetcher(
      () => axios.post(R["sim:session:post:leave"]({ id: vars.params.id }), vars.body),
      ZSim.SimSessionPostLeave.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

export default {
  "sim:module:get:all": simModuleGetAll,
  "sim:module-completion:get:all": simModuleCompletionGetAll,
  "sim:collection:get:all": simCollectionGetAll,
  "sim:collection:get:modules": simCollectionGetModules,
  "sim:session:get:stats": simSessionGetStats,
  "sim:session:get:players": simSessionGetPlayers,
  "sim:module:get:stats": simModuleGetStats,
  "sim:session:post:join": simSessionPostJoin,
  "sim:session:post:leave": simSessionPostLeave,
};
