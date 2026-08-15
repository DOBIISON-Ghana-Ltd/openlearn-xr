import fetcher, { ApiError } from "@/data/fetcher";
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
    if (query.mode === "local") {
      const attempt = (await localDB.getPlayAttempt(params.playId))!;
      query.checkpointId = attempt.currentCheckpointId || "";

      const res = await fetcher(
        () => axios.get(R["sim:checkpoint:get:one"](params), { params: query }),
        ZSim.SimCheckpointGetOne.shape.res
      );

      return {
        checkpoint: res.checkpoint,
        meta: {
          currentCheckpointIndex: attempt.currentCheckpointIndex ?? 0,
          totalCheckpoints: attempt.totalCheckpoints ?? 0,
          accumulatedPoints: attempt.accumulatedPoints ?? 0,
        },
      };
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
  mutationFn: async ({ params, body }: Pick<Infer["SimCheckpointPostAnswer"], "params" | "body">) => {
    if (body.mode === "local") {
      const attempt = (await localDB.getPlayAttempt(params.playId))!;
      body.checkpointId = attempt.currentCheckpointId || "";

      const res = await fetcher(
        () => axios.post(R["sim:checkpoint:post:answer"](params), body),
        ZSim.SimCheckpointPostAnswer.shape.res
      );

      const updatedPoints = attempt.accumulatedPoints + (res.isCorrect ? res.pointsAwarded : 0);
      const nextCheckpointIndex = (attempt.currentCheckpointIndex ?? 0) + 1;

      // 1. Update PlayAttempt in IndexedDB
      await localDB.upsertPlayAttempt({
        moduleVersionId: params.playId,
        currentCheckpointId: res.nextCheckpointId || attempt.currentCheckpointId,
        currentCheckpointIndex: nextCheckpointIndex,
        accumulatedPoints: updatedPoints,
      });

      // 2. If finished, save module completion
      if (!res.nextCheckpointId && res.moduleId) {
        const existingCompletion = await localDB.getModuleCompletion(res.moduleId);

        await localDB.upsertModuleCompletion({
          moduleId: res.moduleId,
          lastPlayedVersionId: params.playId,
          score: updatedPoints,
          highScore: Math.max(existingCompletion?.highScore ?? 0, updatedPoints),
          totalPlays: (existingCompletion?.totalPlays ?? 0) + 1,
          lastPlayedAt: new Date().toISOString(),
        });
      }

      return res;
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
    const data = await fetcher(
      () => axios.post(R["sim:session:post:join"](), vars.body),
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

const simSessionPostEnd = {
  type: "mutation",
  mutationFn: async (vars: Pick<Infer["SimSessionPostEnd"], "params">) => {
    const data = await fetcher(
      () => axios.post(R["sim:session:post:end"]({ id: vars.params.id }), {}),
      ZSim.SimSessionPostEnd.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const simGeneralGetScore = {
  type: "query",
  queryKey: ({ params }: Pick<Infer["SimGeneralGetScore"], "params">) =>
    [...QUERY_KEYS["sim:general:get:score"](params.playId)],
  queryFn: async ({ params }: Pick<Infer["SimGeneralGetScore"], "params">) => {
    if (params.mode === "local") {
      const [completion, attempt] = await Promise.all([
        localDB.getModuleCompletion(params.playId),
        localDB.getPlayAttempt(params.playId),
      ]);
      return { score: completion?.lastScore ?? attempt?.accumulatedPoints ?? 0 };
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
  queryFn: async ({ params, query }: Pick<Infer["SimGeneralGetNavigate"], "params" | "query">) => {
    if (params.mode === "local") {
      let attempt = await localDB.getPlayAttempt(params.playId);
      if (!attempt) {
        const res = await fetcher(
          () => axios.get(R["sim:general:get:navigate"](params), { params: query }),
          ZSim.SimGeneralGetNavigate.shape.res
        );

        attempt = await localDB.upsertPlayAttempt({
          moduleVersionId: params.playId,
          currentTab: 0,
          progress: 0,
          accumulatedPoints: 0,
          currentCheckpointIndex: 0,
          currentCheckpointId: res.checkpointId ?? null,
          totalCheckpoints: res.totalCheckpoints ?? 0,
        });

        return { currentTab: 0, progress: 0 };
      }

      const currentTab = attempt.currentTab ?? 0;
      const progress = attempt.progress ?? Math.round((currentTab / 5) * 100);
      return { currentTab, progress };
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
  mutationFn: async ({ params, body }: Pick<Infer["SimGeneralPostNavigate"], "params" | "body">) => {
    if (params.mode === "local") {
      await localDB.upsertPlayAttempt({
        moduleVersionId: params.playId,
        currentTab: body.nextTab,
        progress: Math.round((body.nextTab / 5) * 100),
      });

      return "Navigation updated successfully.";
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
    const data = await fetcher(
      () => axios.post(R["sim:general:post:retake"](vars.params)),
      ZSim.SimGeneralPostRetake.shape.res
    );

    if (vars.params.mode === "local") {
      await localDB.upsertPlayAttempt({
        moduleVersionId: vars.params.playId,
        currentTab: 0,
        progress: 0,
        currentCheckpointIndex: 0,
        accumulatedPoints: 0,
        currentCheckpointId: data.checkpointId ?? null,
        totalCheckpoints: data.totalCheckpoints ?? 0,
      });
    }

    return data;
  },
} satisfies MutationConfig;

const simModuleGetSlug = {
  type: "query",
  queryKey: ({ params }: Pick<Infer["SimModuleGetSlug"], "params">) => [...QUERY_KEYS["sim:module:get:slug"](params.id)],
  queryFn: async ({ params, query }: Pick<Infer["SimModuleGetSlug"], "params" | "query">) => {
    const data = await fetcher(
      () => axios.get(R["sim:module:get:slug"](params), { params: query }),
      ZSim.SimModuleGetSlug.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

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

  "sim:module-completion:get:all": simModuleCompletionGetAll,

  "sim:collection:get:all": simCollectionGetAll,
  "sim:collection:get:modules": simCollectionGetModules,

  "sim:session:get:stats": simSessionGetStats,
  "sim:session:get:players": simSessionGetPlayers,
  "sim:session:post:join": simSessionPostJoin,
  "sim:session:post:leave": simSessionPostLeave,
  "sim:session:post:end": simSessionPostEnd,
};
