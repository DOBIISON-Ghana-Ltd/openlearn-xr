import { getOpenLearnDB, PlayAttemptRecord } from "../db";

export async function getPlayAttempt(
  moduleVersionId: string
): Promise<PlayAttemptRecord | null> {
  try {
    const db = await getOpenLearnDB();
    const attempt = await db.get("playAttempts", moduleVersionId);
    return attempt ?? null;
  } catch (error) {
    console.error("[LocalDB] Error fetching play attempt:", error);
    return null;
  }
}

export async function upsertPlayAttempt(params: {
  moduleVersionId: string;
  currentCheckpointId?: string | null;
  accumulatedPoints?: number;
}): Promise<PlayAttemptRecord | null> {
  try {
    const db = await getOpenLearnDB();
    const existing = await db.get("playAttempts", params.moduleVersionId);
    const now = new Date().toISOString();

    const record: PlayAttemptRecord = {
      moduleVersionId: params.moduleVersionId,
      currentCheckpointId: params.currentCheckpointId ?? existing?.currentCheckpointId ?? null,
      accumulatedPoints: params.accumulatedPoints ?? existing?.accumulatedPoints ?? 0,
      updatedAt: now,
    };

    await db.put("playAttempts", record);
    return record;
  } catch (error) {
    console.error("[LocalDB] Error saving play attempt:", error);
    return null;
  }
}

export async function deletePlayAttempt(moduleVersionId: string): Promise<boolean> {
  try {
    const db = await getOpenLearnDB();
    await db.delete("playAttempts", moduleVersionId);
    return true;
  } catch (error) {
    console.error("[LocalDB] Error deleting play attempt:", error);
    return false;
  }
}
