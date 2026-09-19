import { z } from "zod";
import { nanoid } from "nanoid";
import {
  ZPlayAttempt,
  ZModuleCompletion,
  ZCollectionProgress,
  PlayModeEnum,
  ZDate,
} from "@/data/schema.base";

// ==========================================
// LOCAL STORAGE ENTITY SCHEMAS (ZOD-DRIVEN)
// ==========================================

export const ZLocalPlayAttempt = ZPlayAttempt.extend({
  id: z.string().default(() => nanoid()),
  userId: z.string().nullable().default(null),
  sessionId: z.string().nullable().default(null),
  moduleVersionId: z.string(),
  playMode: PlayModeEnum.default("module"),
  currentCheckpointId: z.string().nullable().default(null),
  currentCheckpointIndex: z.number().int().default(0),
  totalCheckpoints: z.number().int().default(0),
  currentTab: z.number().int().default(0),
  progress: z.number().int().default(0),
  accumulatedPoints: z.number().int().default(0),
  totalCheckpointPoints: z.number().int().default(0),
  preAssessmentEarnedPoints: z.number().int().default(0),
  preAssessmentTotalPoints: z.number().int().default(0),
  sessionPlayerId: z.string().nullable().default(null),
  createdAt: ZDate.default(() => new Date().toISOString()),
  updatedAt: ZDate.default(() => new Date().toISOString()),
});

export const ZLocalModuleCompletion = ZModuleCompletion.extend({
  id: z.string().default(() => nanoid()),
  userId: z.string().default("local_user"),
  moduleId: z.string(),
  lastPlayedVersionId: z.string().nullable().default(null),
  highScore: z.number().int().default(0),
  lastScore: z.number().int().default(0),
  totalPlays: z.number().int().default(0),
  lastPlayedAt: ZDate.nullable().default(() => new Date().toISOString()),
  createdAt: ZDate.default(() => new Date().toISOString()),
  updatedAt: ZDate.default(() => new Date().toISOString()),
});

export const ZLocalCollectionProgress = ZCollectionProgress.extend({
  id: z.string().default(() => nanoid()),
  userId: z.string().default("local_user"),
  collectionId: z.string(),
  activeIndex: z.number().int().default(0),
  createdAt: ZDate.default(() => new Date().toISOString()),
  updatedAt: ZDate.default(() => new Date().toISOString()),
});

// ==========================================
// INFERRED TYPES
// ==========================================

export type LocalPlayAttempt = z.infer<typeof ZLocalPlayAttempt>;
export type LocalModuleCompletion = z.infer<typeof ZLocalModuleCompletion>;
export type LocalCollectionProgress = z.infer<typeof ZLocalCollectionProgress>;
