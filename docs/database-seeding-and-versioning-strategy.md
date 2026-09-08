# Database Seeding & Content Versioning Strategy

## 1. Overview & Core Philosophy

When managing educational curriculum modules, checkpoints, and user progression state in PostgreSQL, avoiding data corruption and foreign key cascade destruction is critical.

### Why "Purging and Re-inserting with Hardcoded UUIDs" is an Anti-Pattern:
1. **Foreign Key Cascade Deletions**: Tables like `PlayAttempt`, `SessionPlayer`, `SessionCheckpoint`, and `ModuleCompletion` reference `ModuleVersion.id` and `Module.id`. Deleting and re-inserting module records destroys all historical student attempts, scores, and analytics.
2. **Brittle Seed Data**: Manually hardcoding synthetic UUIDs in source code is error-prone, hard to maintain across environments, and conflicts with dynamic editor-authored content.

---

## 2. The Recommended Architecture: Natural Keys (`slug`) & Idempotent Upserts

In Open Learn XR:
- `Collection` has a natural unique identifier: `slug: String @unique` (e.g. `"physics"`).
- `Module` has a natural unique identifier: `slug: String @unique` (e.g. `"series-and-parallel-connections-of-capacitors"`).
- `ModuleVersion` is uniquely identified by composite key: `@@unique([moduleId, versionNumber])`.

### Idempotent Upsert Seeding Pattern
By writing the seed script using Prisma `upsert` keyed by `slug`, the seed script can be run multiple times safely (`npx prisma db seed`) without wiping the database, duplicating records, or breaking student attempts.

```typescript
// prisma/seed.ts (Template for future idempotent implementation)

import "dotenv/config";
import prisma from "../src/adapters/db/client";
import { data } from "./data";

async function main() {
  console.log("🌱 Running idempotent database seed...");

  for (const collectionData of data) {
    // 1. Upsert Collection by natural key (slug)
    const collection = await prisma.collection.upsert({
      where: { slug: collectionData.slug },
      update: {
        name: collectionData.name,
        description: collectionData.description,
        grade: collectionData.grade,
      },
      create: {
        name: collectionData.name,
        slug: collectionData.slug,
        description: collectionData.description,
        grade: collectionData.grade,
      },
    });

    for (const moduleData of collectionData.modules) {
      // 2. Upsert Module by natural key (slug)
      const moduleRecord = await prisma.module.upsert({
        where: { slug: moduleData.slug },
        update: {
          collectionId: collection.id,
          title: moduleData.title,
          description: moduleData.description,
          duration: moduleData.duration,
          difficulty: moduleData.difficulty,
          orderIndex: moduleData.orderIndex,
          image: moduleData.image || null,
        },
        create: {
          collectionId: collection.id,
          slug: moduleData.slug,
          title: moduleData.title,
          description: moduleData.description,
          duration: moduleData.duration,
          difficulty: moduleData.difficulty,
          orderIndex: moduleData.orderIndex,
          image: moduleData.image || null,
        },
      });

      for (const versionData of moduleData.versions) {
        // 3. Upsert ModuleVersion by composite key [moduleId, versionNumber]
        const versionRecord = await prisma.moduleVersion.upsert({
          where: {
            moduleId_versionNumber: {
              moduleId: moduleRecord.id,
              versionNumber: versionData.versionNumber,
            },
          },
          update: {
            status: versionData.status,
            changeNote: versionData.changeNote,
            interactiveConfig: versionData.interactiveConfig,
            notes: versionData.notes as any,
          },
          create: {
            moduleId: moduleRecord.id,
            versionNumber: versionData.versionNumber,
            status: versionData.status,
            changeNote: versionData.changeNote,
            interactiveConfig: versionData.interactiveConfig,
            notes: versionData.notes as any,
            createdById: adminUser.id,
            publishedAt: new Date(),
          },
        });

        // 4. Update Checkpoints in place for this version
        // Replace checkpoints for this specific version without affecting other versions or module IDs
        await prisma.moduleCheckpoint.deleteMany({
          where: { moduleVersionId: versionRecord.id },
        });

        await prisma.moduleCheckpoint.createMany({
          data: versionData.checkpoints.map((cp) => ({
            ...cp,
            moduleVersionId: versionRecord.id,
          })),
        });
      }
    }
  }

  console.log("✅ Idempotent seed completed successfully.");
}
```

---

## 3. Handling Content Updates & Checkpoint Changes

### Scenario A: Minor Typos / Question Corrections (Development & Fixes)
- Update `prisma/data.ts` with the corrected question text or hint.
- Run `npx prisma db seed`.
- The script deletes and recreates only the `ModuleCheckpoint` rows for that `ModuleVersion`, leaving `Module.id` and `ModuleVersion.id` untouched.
- Student `ModuleCompletion` and high scores remain intact.

### Scenario B: Major Curriculum Restructuring (Production Content Versioning)
- When a lab experiment or question set undergoes major structural overhaul:
  1. Do not mutate `versionNumber: 1`.
  2. Create a new entry in `prisma/data.ts` under `versions` with `versionNumber: 2`.
  3. Run `npx prisma db seed`.
  4. Active classroom sessions and new solo plays automatically run on `Version 2`.
  5. Past student `PlayAttempt`s remain tied to `Version 1`, preserving metric integrity and historic audit trails.

---

## 4. Pre-Assessment & Checkpoint Points Conventions
- **Pre-Assessment Questions**: Stored within `ModuleVersion.notes.engage.preAssessment`. Each question supports an optional `points?: number` property. If omitted, frontend flows default to `points ?? 25`.
- **Checkpoint Questions**: Stored in `ModuleCheckpoint.points` (integer, defaults to `25`).
- **PlayAttempt Tracking**:
  - `preAssessmentEarnedPoints`: Accumulated score on pre-assessment questions.
  - `preAssessmentTotalPoints`: Total possible points for pre-assessment questions.
  - `accumulatedPoints`: Live staged points from post-assessment checkpoints.
  - `totalCheckpointPoints`: Total possible points from post-assessment checkpoints.
