import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface ModuleCompletionRecord {
  id: string;
  moduleId: string;
  lastPlayedVersionId?: string | null;
  highScore: number;
  lastScore: number;
  totalPlays: number;
  lastPlayedAt: string;
}

export interface CollectionProgressRecord {
  collectionId: string;
  activeIndex: number;
  updatedAt: string;
}

export interface PlayAttemptRecord {
  moduleVersionId: string;
  currentTab?: number;
  progress?: number;
  currentCheckpointId?: string | null;
  currentCheckpointIndex?: number;
  totalCheckpoints?: number;
  accumulatedPoints: number;
  updatedAt: string;
}

export interface OpenLearnDBSchema extends DBSchema {
  moduleCompletions: {
    key: string; // moduleId
    value: ModuleCompletionRecord;
    indexes: {
      "by-lastPlayedAt": string;
      "by-lastPlayedVersionId": string;
    };
  };
  collectionProgress: {
    key: string; // collectionId
    value: CollectionProgressRecord;
  };
  playAttempts: {
    key: string; // moduleVersionId
    value: PlayAttemptRecord;
  };
}

const DB_NAME = "openlearn_xr_offline_db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OpenLearnDBSchema>> | null = null;

export function getOpenLearnDB(): Promise<IDBPDatabase<OpenLearnDBSchema>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available on server-side"));
  }

  if (!dbPromise) {
    dbPromise = openDB<OpenLearnDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("moduleCompletions")) {
          const completionStore = db.createObjectStore("moduleCompletions", {
            keyPath: "moduleId",
          });
          completionStore.createIndex("by-lastPlayedAt", "lastPlayedAt");
          completionStore.createIndex("by-lastPlayedVersionId", "lastPlayedVersionId");
        }

        if (!db.objectStoreNames.contains("collectionProgress")) {
          db.createObjectStore("collectionProgress", {
            keyPath: "collectionId",
          });
        }

        if (!db.objectStoreNames.contains("playAttempts")) {
          db.createObjectStore("playAttempts", {
            keyPath: "moduleVersionId",
          });
        }
      },
    });
  }

  return dbPromise;
}
