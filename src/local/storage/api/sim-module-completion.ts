import { getOpenLearnDB, ModuleCompletionRecord } from "../db";

export async function getModuleCompletions(): Promise<ModuleCompletionRecord[]> {
  try {
    const db = await getOpenLearnDB();
    const completions = await db.getAll("moduleCompletions");
    return completions;
  } catch (error) {
    console.error("[LocalDB] Error fetching module completions:", error);
    return [];
  }
}

export async function getModuleCompletion(
  moduleId: string
): Promise<ModuleCompletionRecord | null> {
  try {
    const db = await getOpenLearnDB();
    const completion = await db.get("moduleCompletions", moduleId);
    return completion ?? null;
  } catch (error) {
    console.error("[LocalDB] Error fetching module completion:", error);
    return null;
  }
}

export async function upsertModuleCompletion(params: {
  moduleId: string;
  score?: number;
  highScore?: number;
  totalPlays?: number;
  lastPlayedVersionId?: string | null;
  lastPlayedAt?: string;
}): Promise<ModuleCompletionRecord | null> {
  try {
    const db = await getOpenLearnDB();
    const existing = await db.get("moduleCompletions", params.moduleId);
    const now = params.lastPlayedAt ?? new Date().toISOString();
    const currentScore = params.score ?? params.highScore ?? 0;
    const bestScore = Math.max(existing?.highScore ?? 0, params.highScore ?? currentScore);

    const record: ModuleCompletionRecord = {
      id: existing?.id ?? `local_${params.moduleId}`,
      moduleId: params.moduleId,
      lastPlayedVersionId: params.lastPlayedVersionId ?? existing?.lastPlayedVersionId ?? null,
      highScore: bestScore,
      lastScore: currentScore,
      totalPlays: params.totalPlays ?? (existing?.totalPlays ?? 0) + 1,
      lastPlayedAt: now,
    };

    await db.put("moduleCompletions", record);
    return record;
  } catch (error) {
    console.error("[LocalDB] Error saving module completion:", error);
    return null;
  }
}
