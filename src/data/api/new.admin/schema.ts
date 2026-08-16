import z from "zod";
import { ZCollection, ZModule, ZModuleCheckpoint, ZModuleVersion } from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET /api/ses/sessions/[id]/player-summary — session player summary
// ---------------------------------------------------------------------------
const SeedModules = z.object({
  name: ZCollection.shape.name,
  slug: ZCollection.shape.slug,
  description: ZCollection.shape.description,
  grade: ZCollection.shape.grade,
  modules: z.object({
    title: ZModule.shape.title,
    slug: ZModule.shape.slug,
    description: ZModule.shape.description,
    image: ZModule.shape.image,
    duration: ZModule.shape.duration,
    difficulty: ZModule.shape.difficulty,
    orderIndex: ZModule.shape.orderIndex,
    versions: z.object({
      versionNumber: ZModuleVersion.shape.versionNumber,
      status: ZModuleVersion.shape.status,
      interactiveConfig: ZModuleVersion.shape.interactiveConfig,
      changeNote: ZModuleVersion.shape.changeNote,
      notes: ZModuleVersion.shape.notes.unwrap(),
      checkpoints: ZModuleCheckpoint.pick({
        question: true,
        options: true,
        correctAnswer: true,
        orderIndex: true,
        points: true,
        hint: true,
        explanation: true
      }).array()
    }).array()
  }).array()
}).array();

const schema = {
  SeedModules,
};

export default schema;