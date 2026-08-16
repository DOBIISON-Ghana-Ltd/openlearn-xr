import { getOpenLearnDB, CollectionProgressRecord } from "../db";

export async function getCollectionProgress(
  collectionId: string
): Promise<CollectionProgressRecord | null> {
  try {
    const db = await getOpenLearnDB();
    const progress = await db.get("collectionProgress", collectionId);
    return progress ?? null;
  } catch (error) {
    console.error("[LocalDB] Error fetching collection progress:", error);
    return null;
  }
}

export async function upsertCollectionProgress(
  collectionId: string,
  activeIndex: number
): Promise<CollectionProgressRecord | null> {
  try {
    const db = await getOpenLearnDB();
    const existing = await db.get("collectionProgress", collectionId);
    const now = new Date().toISOString();

    const record: CollectionProgressRecord = {
      collectionId,
      activeIndex: Math.max(existing?.activeIndex ?? 0, activeIndex),
      updatedAt: now,
    };

    await db.put("collectionProgress", record);
    return record;
  } catch (error) {
    console.error("[LocalDB] Error saving collection progress:", error);
    return null;
  }
}
