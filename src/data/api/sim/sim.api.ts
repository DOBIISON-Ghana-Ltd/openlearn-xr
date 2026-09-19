import fetcher, { ApiError } from "@/data/fetcher";
import { axios } from "@/data/axios";
import { Infer, QueryConfig, MutationConfig } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZSim from "./sim.schema";
import { SimLocalService } from "@/local/services";

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

const simModuleGetOne = {
  type: "query",
  queryKey: ({ params, query }: Pick<Infer["SimModuleGetOne"], "params" | "query">) => [...QUERY_KEYS["sim:module:get:one"](params.id, query)],
  queryFn: async (vars: Pick<Infer["SimModuleGetOne"], "params" | "query">) => {
    const { params, query } = vars;
    const data = await fetcher(
      () => axios.get(R["sim:module:get:one"](params), { params: query }),
      ZSim.SimModuleGetOne.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simCheckpointGetOne = {
  type: "query",
  queryKey: ({ params, query }: Pick<Infer["SimCheckpointGetOne"], "params" | "query">) => [...QUERY_KEYS["sim:checkpoint:get:one"](params.playId, query)],
  queryFn: async (vars: Pick<Infer["SimCheckpointGetOne"], "params" | "query">) => {
    const { params, query } = vars;
    if (query.mode === "local") {
      return SimLocalService.checkpointGetOne(vars);
    }

    const res = await fetcher(
      () => axios.get(R["sim:checkpoint:get:one"](params), { params: query }),
      ZSim.SimCheckpointGetOne.shape.res
    );
    return res;
  },
  options: {
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 0,
  },
} satisfies QueryConfig;

const simCheckpointPostAnswer = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimCheckpointPostAnswer"], "params" | "body">) => {
    const { params, body } = vars;
    if (body.mode === "local") {
      return SimLocalService.checkpointPostAnswer(vars);
    }

    const data = await fetcher(
      () => axios.post(R["sim:checkpoint:post:answer"](params), body),
      ZSim.SimCheckpointPostAnswer.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

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

const simSessionGetCheckpoints = {
  type: "query",
  queryKey: (params: Infer["SimSessionGetCheckpoints"]["params"]) => [...QUERY_KEYS["sim:session:get:checkpoints"](params.id)],
  queryFn: async (params: Infer["SimSessionGetCheckpoints"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["sim:session:get:checkpoints"](params)),
      ZSim.SimSessionGetCheckpoints.shape.res
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
  mutationFn: async (vars: Pick<Infer["SimSessionPostJoin"], "body">) => {
    const { body } = vars;
    const data = await fetcher(
      () => axios.post(R["sim:session:post:join"](), body),
      ZSim.SimSessionPostJoin.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simSessionPostLeave = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimSessionPostLeave"], "params" | "body">) => {
    const { params, body } = vars;
    const data = await fetcher(
      () => axios.post(R["sim:session:post:leave"]({ id: params.id }), body),
      ZSim.SimSessionPostLeave.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simSessionPostEnd = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimSessionPostEnd"], "params">) => {
    const { params } = vars;
    const data = await fetcher(
      () => axios.post(R["sim:session:post:end"]({ id: params.id }), {}),
      ZSim.SimSessionPostEnd.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simGeneralGetScore = {
  type: "query",
  queryKey: ({ params }: Pick<Infer["SimGeneralGetScore"], "params">) =>
    [...QUERY_KEYS["sim:general:get:score"](params.playId)],
  queryFn: async (vars: Pick<Infer["SimGeneralGetScore"], "params">) => {
    const { params } = vars;
    if (params.mode === "local") {
      return SimLocalService.generalGetScore(vars);
    }

    const data = await fetcher(
      () => axios.get(R["sim:general:get:score"](params)),
      ZSim.SimGeneralGetScore.shape.res
    );

    return data;
  },
  options: {
    refetchOnMount: "always",
    staleTime: 0,
  },
} satisfies QueryConfig;

const simGeneralGetNavigate = {
  type: "query",
  queryKey: ({ params }: Pick<Infer["SimGeneralGetNavigate"], "params">) =>
    [...QUERY_KEYS["sim:general:get:navigate"](params.playId)],
  queryFn: async (vars: Pick<Infer["SimGeneralGetNavigate"], "params" | "query">) => {
    const { params, query } = vars;
    if (params.mode === "local") {
      return SimLocalService.generalGetNavigate(vars);
    }

    const data = await fetcher(
      () => axios.get(R["sim:general:get:navigate"](params), { params: query }),
      ZSim.SimGeneralGetNavigate.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simGeneralPostNavigate = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimGeneralPostNavigate"], "params" | "body">) => {
    const { params, body } = vars;
    if (params.mode === "local") {
      return SimLocalService.generalPostNavigate(vars);
    }

    const data = await fetcher(
      () => axios.post(R["sim:general:post:navigate"](params), body),
      ZSim.SimGeneralPostNavigate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simGeneralPostRetake = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimGeneralPostRetake"], "params">) => {
    const { params } = vars;
    if (params.mode === "local") {
      return SimLocalService.generalPostRetake(vars);
    }

    const data = await fetcher(
      () => axios.post(R["sim:general:post:retake"](params)),
      ZSim.SimGeneralPostRetake.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simGeneralPostTestScore = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimGeneralPostTestScore"], "params" | "body">) => {
    const { params, body } = vars;
    if (params.mode === "local") {
      return SimLocalService.generalPostTestScore(vars);
    }

    const data = await fetcher(
      () => axios.post(R["sim:general:post:test-score"](params), body),
      ZSim.SimGeneralPostTestScore.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simModuleGetSlug = {
  type: "query",
  queryKey: ({ params }: Pick<Infer["SimModuleGetSlug"], "params">) => [...QUERY_KEYS["sim:module:get:slug"](params.id)],
  queryFn: async (vars: Pick<Infer["SimModuleGetSlug"], "params" | "query">) => {
    const { params, query } = vars;
    const data = await fetcher(
      () => axios.get(R["sim:module:get:slug"](params), { params: query }),
      ZSim.SimModuleGetSlug.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const simSessionAnalyticsPostOne = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimSessionAnalyticsPostOne"], "body">) => {
    const { body } = vars;
    const data = await fetcher(
      () => axios.post(R["sim:session-analytics:post:one"](), body),
      ZSim.SimSessionAnalyticsPostOne.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

export default {
  "sim:module:get:all": simModuleGetAll,
  "sim:module:get:one": simModuleGetOne,
  "sim:module:get:slug": simModuleGetSlug,
  "sim:module:get:stats": simModuleGetStats,

  "sim:checkpoint:get:one": simCheckpointGetOne,
  "sim:checkpoint:post:answer": simCheckpointPostAnswer,

  "sim:general:get:score": simGeneralGetScore,
  "sim:general:get:navigate": simGeneralGetNavigate,
  "sim:general:post:navigate": simGeneralPostNavigate,
  "sim:general:post:retake": simGeneralPostRetake,
  "sim:general:post:test-score": simGeneralPostTestScore,

  "sim:module-completion:get:all": simModuleCompletionGetAll,

  "sim:collection:get:all": simCollectionGetAll,
  "sim:collection:get:modules": simCollectionGetModules,

  "sim:session:get:stats": simSessionGetStats,
  "sim:session:get:players": simSessionGetPlayers,
  "sim:session:get:checkpoints": simSessionGetCheckpoints,
  "sim:session:post:join": simSessionPostJoin,
  "sim:session:post:leave": simSessionPostLeave,
  "sim:session:post:end": simSessionPostEnd,

  "sim:session-analytics:post:one": simSessionAnalyticsPostOne,
};
