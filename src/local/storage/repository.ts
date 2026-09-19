import { z } from "zod";
import { StoreNames, IndexNames, IndexKey } from "idb";
import { getOpenLearnDB, OpenLearnDBSchema } from "./db/client";

export class LocalRepository<
  TStoreName extends StoreNames<OpenLearnDBSchema>,
  TSchema extends z.ZodTypeAny,
  TOutput = z.output<TSchema>,
  TInput = z.input<TSchema>
> {
  constructor(
    public readonly storeName: TStoreName,
    public readonly schema: TSchema
  ) {}

  async get(key: string): Promise<TOutput | null> {
    try {
      const db = await getOpenLearnDB();
      const raw = await db.get(this.storeName, key);
      if (!raw) return null;

      const parsed = this.schema.safeParse(raw);
      if (!parsed.success) {
        console.warn(
          `[LocalDB:${this.storeName}] Record failed schema validation for key "${key}":`,
          parsed.error.issues
        );
        return null;
      }
      return parsed.data as TOutput;
    } catch (error) {
      console.error(`[LocalDB:${this.storeName}] Error reading key "${key}":`, error);
      return null;
    }
  }

  async getAll(): Promise<TOutput[]> {
    try {
      const db = await getOpenLearnDB();
      const rawList = await db.getAll(this.storeName);
      const results: TOutput[] = [];

      for (const item of rawList) {
        const parsed = this.schema.safeParse(item);
        if (parsed.success) {
          results.push(parsed.data as TOutput);
        }
      }

      return results;
    } catch (error) {
      console.error(`[LocalDB:${this.storeName}] Error fetching all records:`, error);
      return [];
    }
  }

  async getFromIndex<TIndex extends IndexNames<OpenLearnDBSchema, TStoreName>>(
    indexName: TIndex,
    key: IndexKey<OpenLearnDBSchema, TStoreName, TIndex>
  ): Promise<TOutput | null> {
    try {
      const db = await getOpenLearnDB();
      const raw = await db.getFromIndex(this.storeName, indexName, key);
      if (!raw) return null;

      const parsed = this.schema.safeParse(raw);
      if (!parsed.success) return null;
      return parsed.data as TOutput;
    } catch (error) {
      console.error(
        `[LocalDB:${this.storeName}] Error reading from index "${String(indexName)}":`,
        error
      );
      return null;
    }
  }

  async put(value: TInput): Promise<TOutput> {
    const db = await getOpenLearnDB();
    const validated = this.schema.parse(value) as TOutput;
    await db.put(this.storeName, validated as any);
    return validated;
  }

  async patch(
    key: string,
    updater: (existing: TOutput | null) => Partial<TInput>
  ): Promise<TOutput> {
    const existing = await this.get(key);
    const updates = updater(existing);
    const merged = {
      ...(existing ?? {}),
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const validated = this.schema.parse(merged) as TOutput;
    const db = await getOpenLearnDB();
    await db.put(this.storeName, validated as any);
    return validated;
  }

  async delete(key: string): Promise<boolean> {
    try {
      const db = await getOpenLearnDB();
      await db.delete(this.storeName, key);
      return true;
    } catch (error) {
      console.error(`[LocalDB:${this.storeName}] Error deleting key "${key}":`, error);
      return false;
    }
  }
}
