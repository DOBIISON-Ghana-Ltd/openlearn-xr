import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import R from "@/data/route-factory";
import { Infer } from "@/data/types.base";
import ZSim from "@/data/api/sim/sim.schema";
import { nanoid } from "nanoid";
import {
  playAttemptRepo,
  moduleCompletionRepo,
} from "@/local/storage/repositories";

export const SimLocalService = {
  /**
   * Fetch single checkpoint for offline mode, augmenting with stored attempt metadata
   */
  async checkpointGetOne(
    vars: Pick<Infer["SimCheckpointGetOne"], "params" | "query">
  ): Promise<Infer["SimCheckpointGetOne"]["res"]> {
    const { params, query } = vars;
    const attempt = await playAttemptRepo.get(params.playId);
    const queryParams = {
      ...query,
      checkpointId: attempt?.currentCheckpointId || "",
    };

    const res = await fetcher(
      () =>
        axios.get(R["sim:checkpoint:get:one"](params), {
          params: queryParams,
        }),
      ZSim.SimCheckpointGetOne.shape.res
    );

    return {
      checkpoint: res.checkpoint,
      meta: {
        currentCheckpointIndex: attempt?.currentCheckpointIndex ?? 0,
        totalCheckpoints: attempt?.totalCheckpoints ?? 0,
        accumulatedPoints: attempt?.accumulatedPoints ?? 0,
      },
    };
  },

  /**
   * Post checkpoint answer, increment local score/points, advance checkpoint, and record completion if final
   */
  async checkpointPostAnswer(
    vars: Pick<Infer["SimCheckpointPostAnswer"], "params" | "body">
  ): Promise<Infer["SimCheckpointPostAnswer"]["res"]> {
    const { params, body } = vars;
    const attempt = await playAttemptRepo.get(params.playId);
    const bodyPayload = {
      ...body,
      checkpointId: attempt?.currentCheckpointId || "",
    };

    const res = await fetcher(
      () => axios.post(R["sim:checkpoint:post:answer"](params), bodyPayload),
      ZSim.SimCheckpointPostAnswer.shape.res
    );

    const updatedPoints =
      (attempt?.accumulatedPoints ?? 0) + (res.isCorrect ? res.pointsAwarded : 0);
    const updatedTotalPoints =
      (attempt?.totalCheckpointPoints ?? 0) + (res.checkpointPoints ?? 0);
    const nextCheckpointIndex = (attempt?.currentCheckpointIndex ?? 0) + 1;

    // 1. Atomically update PlayAttempt in IndexedDB
    await playAttemptRepo.patch(params.playId, () => ({
      moduleVersionId: params.playId,
      currentCheckpointId:
        res.nextCheckpointId || attempt?.currentCheckpointId || null,
      currentCheckpointIndex: nextCheckpointIndex,
      accumulatedPoints: updatedPoints,
      totalCheckpointPoints: updatedTotalPoints,
    }));

    // 2. If finished, save module completion record
    if (!res.nextCheckpointId && res.moduleId) {
      const existingCompletion = await moduleCompletionRepo.get(res.moduleId);

      await moduleCompletionRepo.patch(res.moduleId, () => ({
        id: existingCompletion?.id ?? nanoid(),
        moduleId: res.moduleId,
        lastPlayedVersionId: params.playId,
        highScore: Math.max(existingCompletion?.highScore ?? 0, updatedPoints),
        lastScore: updatedPoints,
        totalPlays: (existingCompletion?.totalPlays ?? 0) + 1,
        lastPlayedAt: new Date().toISOString(),
      }));
    }

    return res;
  },

  /**
   * Retrieve total score from module completion or active attempt
   */
  async generalGetScore(
    vars: Pick<Infer["SimGeneralGetScore"], "params">
  ): Promise<Infer["SimGeneralGetScore"]["res"]> {
    const { params } = vars;
    const [completion, attempt] = await Promise.all([
      moduleCompletionRepo.get(params.playId),
      playAttemptRepo.get(params.playId),
    ]);

    return {
      score: completion?.lastScore ?? attempt?.accumulatedPoints ?? 0,
    };
  },

  /**
   * Retrieve navigation tab & progress, lazily bootstrapping the attempt if it does not exist
   */
  async generalGetNavigate(
    vars: Pick<Infer["SimGeneralGetNavigate"], "params" | "query">
  ): Promise<Infer["SimGeneralGetNavigate"]["res"]> {
    const { params, query } = vars;
    let attempt = await playAttemptRepo.get(params.playId);

    if (!attempt) {
      const res = await fetcher(
        () =>
          axios.get(R["sim:general:get:navigate"](params), {
            params: query,
          }),
        ZSim.SimGeneralGetNavigate.shape.res
      );

      await playAttemptRepo.patch(params.playId, () => ({
        moduleVersionId: params.playId,
        currentTab: 0,
        progress: 0,
        accumulatedPoints: 0,
        currentCheckpointIndex: 0,
        currentCheckpointId: res.checkpointId ?? null,
        totalCheckpoints: res.totalCheckpoints ?? 0,
      }));

      return { currentTab: 0, progress: 0 };
    }

    const currentTab = attempt.currentTab ?? 0;
    const progress = attempt.progress ?? Math.round((currentTab / 5) * 100);

    return { currentTab, progress };
  },

  /**
   * Update active navigation tab and computed percentage
   */
  async generalPostNavigate(
    vars: Pick<Infer["SimGeneralPostNavigate"], "params" | "body">
  ): Promise<Infer["SimGeneralPostNavigate"]["res"]> {
    const { params, body } = vars;
    await playAttemptRepo.patch(params.playId, () => ({
      moduleVersionId: params.playId,
      currentTab: body.nextTab,
      progress: Math.round((body.nextTab / 5) * 100),
    }));

    return "Navigation updated successfully.";
  },

  /**
   * Reset attempt for replay
   */
  async generalPostRetake(
    vars: Pick<Infer["SimGeneralPostRetake"], "params">
  ): Promise<Infer["SimGeneralPostRetake"]["res"]> {
    const { params } = vars;
    const data = await fetcher(
      () => axios.post(R["sim:general:post:retake"](params)),
      ZSim.SimGeneralPostRetake.shape.res
    );

    await playAttemptRepo.patch(params.playId, () => ({
      moduleVersionId: params.playId,
      currentTab: 0,
      progress: 0,
      currentCheckpointIndex: 0,
      accumulatedPoints: 0,
      totalCheckpointPoints: 0,
      preAssessmentEarnedPoints: 0,
      preAssessmentTotalPoints: 0,
      currentCheckpointId: data.checkpointId ?? null,
      totalCheckpoints: data.totalCheckpoints ?? 0,
    }));

    return data;
  },

  /**
   * Record pre-assessment test score
   */
  async generalPostTestScore(
    vars: Pick<Infer["SimGeneralPostTestScore"], "params" | "body">
  ): Promise<Infer["SimGeneralPostTestScore"]["res"]> {
    const { params, body } = vars;
    await playAttemptRepo.patch(params.playId, () => ({
      moduleVersionId: params.playId,
      preAssessmentEarnedPoints: body.preAssessmentEarnedPoints,
      preAssessmentTotalPoints: body.preAssessmentTotalPoints,
    }));

    return "Pre-assessment score recorded successfully.";
  },
};
