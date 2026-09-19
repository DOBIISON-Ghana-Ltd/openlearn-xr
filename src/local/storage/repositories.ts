import { LocalRepository } from "./repository";
import {
  ZLocalPlayAttempt,
  ZLocalModuleCompletion,
  ZLocalCollectionProgress,
} from "./schema";

export const playAttemptRepo = new LocalRepository(
  "playAttempts",
  ZLocalPlayAttempt
);

export const moduleCompletionRepo = new LocalRepository(
  "moduleCompletions",
  ZLocalModuleCompletion
);

export const collectionProgressRepo = new LocalRepository(
  "collectionProgress",
  ZLocalCollectionProgress
);
