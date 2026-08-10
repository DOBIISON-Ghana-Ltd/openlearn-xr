import prisma from "@/adapters/db/client";

export type PersistCompletionParams = {
  attemptId: string;
  mode: "module:remote" | "session";
  userId?: string | null;
  playId: string; // moduleVersionId or sessionId
  finalScore: number;
  sessionPlayerId?: string | null;
};

export async function persistAttemptCompletion(params: PersistCompletionParams): Promise<void> {
  const { attemptId, mode, userId, playId, finalScore, sessionPlayerId } = params;

  try {
    if (mode === "session") {
      // 1. Session Mode: Update SessionPlayer score & completedAt
      let targetPlayerId = sessionPlayerId;

      if (!targetPlayerId && userId) {
        const player = await prisma.sessionPlayer.findFirst({
          where: { sessionId: playId, userId },
        });
        targetPlayerId = player?.id;
      }

      if (targetPlayerId) {
        await prisma.sessionPlayer.update({
          where: { id: targetPlayerId },
          data: {
            score: finalScore,
            completedAt: new Date(),
          },
        });
      }

      // 2. Delete completed PlayAttempt from Postgres
      await prisma.playAttempt.delete({
        where: { id: attemptId },
      });
    } else if (mode === "module:remote") {
      // 1. Remote Mode: Find ModuleVersion to obtain parent moduleId
      const moduleVersion = await prisma.moduleVersion.findUnique({
        where: { id: playId },
        select: { moduleId: true },
      });

      if (moduleVersion && userId) {
        const existingCompletion = await prisma.moduleCompletion.findFirst({
          where: { userId, moduleId: moduleVersion.moduleId },
        });

        if (existingCompletion) {
          await prisma.moduleCompletion.update({
            where: { id: existingCompletion.id },
            data: {
              highScore: Math.max(existingCompletion.highScore, finalScore),
              lastScore: finalScore,
              totalPlays: { increment: 1 },
              lastPlayedAt: new Date(),
              lastPlayedVersionId: playId,
            },
          });
        } else {
          await prisma.moduleCompletion.create({
            data: {
              userId,
              moduleId: moduleVersion.moduleId,
              highScore: finalScore,
              lastScore: finalScore,
              totalPlays: 1,
              lastPlayedAt: new Date(),
              lastPlayedVersionId: playId,
            },
          });
        }
      }

      // 2. Delete completed PlayAttempt from Postgres
      await prisma.playAttempt.delete({
        where: { id: attemptId },
      });
    }
  } catch (error) {
    console.error("[persistAttemptCompletion] Error finalizing attempt:", error);
  }
}
