import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { Infer, QueryConfig, MutationConfig } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZSim from "./sim.schema";
import * as localDB from "@/local/storage";

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
  queryFn: async ({ params, query }: Pick<Infer["SimModuleGetOne"], "params" | "query">) => {
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
  queryFn: async ({ params, query }: Pick<Infer["SimCheckpointGetOne"], "params" | "query">) => {
    if (query.mode === "module:local") {
      const localAttempt = await localDB.getPlayAttempt(params.playId);
      if (localAttempt?.currentCheckpointId) {
        query.checkpointId = localAttempt.currentCheckpointId;
      }
    }

    const res = await fetcher(
      () => axios.get(R["sim:checkpoint:get:one"](params), { params: query }),
      ZSim.SimCheckpointGetOne.shape.res
    );

    if (query.mode === "module:local" && res.meta?.checkpointId) {
      await localDB.upsertPlayAttempt({
        moduleVersionId: params.playId,
        currentCheckpointId: res.meta.checkpointId,
        accumulatedPoints: 0,
      });
    }

    return res;
  },
  options: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  },
} satisfies QueryConfig;

const simCheckpointPostAnswer = {
  type: "mutation",
  mutationFn: async ({ params, body }: Pick<Infer["SimCheckpointPostAnswer"], "params" | "body">) => {
    let localAttempt = null;

    if (body.mode === "module:local") {
      localAttempt = await localDB.getPlayAttempt(params.playId);
      if (localAttempt?.currentCheckpointId) {
        body.checkpointId = localAttempt.currentCheckpointId;
      }
    }

    const res = await fetcher(
      () => axios.post(R["sim:checkpoint:post:answer"](params), body),
      ZSim.SimCheckpointPostAnswer.shape.res
    );

    if (body.mode === "module:local") {
      const updatedPoints = (localAttempt?.accumulatedPoints ?? 0) + (res.isCorrect ? res.pointsAwarded : 0);

      if (!res.nextCheckpointId && res.moduleId) {
        // Completion reached: Save local module completion & DELETE local play attempt
        const existingCompletion = await localDB.getModuleCompletion(res.moduleId);

        await localDB.upsertModuleCompletion({
          moduleId: res.moduleId,
          lastPlayedVersionId: params.playId,
          score: updatedPoints,
          highScore: Math.max(existingCompletion?.highScore ?? 0, updatedPoints),
          totalPlays: (existingCompletion?.totalPlays ?? 0) + 1,
          lastPlayedAt: new Date().toISOString(),
        });
        await localDB.deletePlayAttempt(params.playId);
      } else {
        // Attempt in progress
        await localDB.upsertPlayAttempt({
          moduleVersionId: params.playId,
          currentCheckpointId: res.nextCheckpointId ?? null,
          accumulatedPoints: updatedPoints,
        });
      }
    }

    return res;
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

const simGeneralGetScore = {
  type: "query",
  queryKey: ({ params, query }: Pick<Infer["SimGeneralGetScore"], "params" | "query">) =>
    [...QUERY_KEYS["sim:general:get:score"](params.playId, query)],
  queryFn: async ({ params, query }: Pick<Infer["SimGeneralGetScore"], "params" | "query">) => {
    const data = await fetcher(
      () => axios.get(R["sim:general:get:score"](params), { params: query }),
      ZSim.SimGeneralGetScore.shape.res
    );

    if (query.mode === "module:local" && data.moduleId) {
      const completion = await localDB.getModuleCompletion(data.moduleId);
      return { score: completion?.lastScore ?? 0 };
    }

    return data;
  },
} satisfies QueryConfig;

export default {
  "sim:module:get:all": simModuleGetAll,
  "sim:module:get:one": simModuleGetOne,
  "sim:checkpoint:get:one": simCheckpointGetOne,
  "sim:checkpoint:post:answer": simCheckpointPostAnswer,
  "sim:general:get:score": simGeneralGetScore,
  "sim:module-completion:get:all": simModuleCompletionGetAll,
  "sim:collection:get:all": simCollectionGetAll,
  "sim:collection:get:modules": simCollectionGetModules,
  "sim:session:get:stats": simSessionGetStats,
  "sim:session:get:players": simSessionGetPlayers,
  "sim:module:get:stats": simModuleGetStats,
  "sim:session:post:join": simSessionPostJoin,
  "sim:session:post:leave": simSessionPostLeave,
};
