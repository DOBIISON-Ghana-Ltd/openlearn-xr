import { openDB, IDBPDatabase, DBSchema } from "idb";
import {
  LocalModuleCompletion,
  LocalCollectionProgress,
  LocalPlayAttempt,
} from "../schema";

export interface OpenLearnDBSchema extends DBSchema {
  moduleCompletions: {
    key: string; // moduleId
    value: LocalModuleCompletion;
    indexes: {
      "by-lastPlayedAt": string;
      "by-lastPlayedVersionId": string;
    };
  };
  collectionProgress: {
    key: string; // collectionId
    value: LocalCollectionProgress;
  };
  playAttempts: {
    key: string; // moduleVersionId
    value: LocalPlayAttempt;
  };
}

export const DB_NAME = "openlearn_xr_offline_db";
export const DB_VERSION = 1;

type MigrationFn = (
  db: IDBPDatabase<OpenLearnDBSchema>,
  transaction: any
) => void | Promise<void>;

const MIGRATIONS: Record<number, MigrationFn> = {
  1: (db) => {
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
};

let dbPromise: Promise<IDBPDatabase<OpenLearnDBSchema>> | null = null;

export function getOpenLearnDB(): Promise<IDBPDatabase<OpenLearnDBSchema>> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("IndexedDB is not available on server-side")
    );
  }

  if (!dbPromise) {
    dbPromise = openDB<OpenLearnDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        const targetVersion = newVersion ?? DB_VERSION;
        for (let v = oldVersion + 1; v <= targetVersion; v++) {
          if (MIGRATIONS[v]) {
            MIGRATIONS[v](db as IDBPDatabase<OpenLearnDBSchema>, transaction);
          }
        }
      },
      blocked() {
        console.warn("[LocalDB] Database upgrade blocked by another active tab");
      },
      blocking() {
        console.warn("[LocalDB] Closing database connection due to upgrade in another tab");
        if (dbPromise) {
          dbPromise.then((db) => db.close());
          dbPromise = null;
        }
      },
    });
  }

  return dbPromise;
}
