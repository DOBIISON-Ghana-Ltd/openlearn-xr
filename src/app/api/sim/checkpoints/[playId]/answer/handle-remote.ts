import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { Infer } from "@/data/types.base";

type IAnswerBody = Infer["SimCheckpointPostAnswer"]["body"];

export function handlePostRemoteAnswer(playId: string, body: IAnswerBody) {
  return secureApiRoute<{ playId: string }>(async (req, ctx, user) => {
    const userId = user.id;

    const attempt = await prisma.playAttempt.findFirst({
      where: { userId, moduleVersionId: playId, playMode: "module" },
    });

    if (!attempt || !attempt.currentCheckpointId) {
      return JSend.error("Play attempt not initialized.", 404);
    }

    const targetCheckpointId = attempt.currentCheckpointId;
    const attemptIdToUpdate = attempt.id;
    const currentAccumulatedPoints = attempt.accumulatedPoints;

    const checkpoint = await prisma.moduleCheckpoint.findUnique({
      where: { id: targetCheckpointId },
      include: {
        moduleVersion: {
          select: { moduleId: true },
        },
      },
    });

    if (!checkpoint) {
      return JSend.error("Checkpoint not found", 404);
    }

    const isCorrect = body.selectedIndex === checkpoint.correctAnswer;
    const pointsAwarded = isCorrect ? checkpoint.points : 0;
    const moduleId = checkpoint.moduleVersion.moduleId;

    const nextCheckpoint = await prisma.moduleCheckpoint.findFirst({
      where: {
        moduleVersionId: checkpoint.moduleVersionId,
        id: { not: targetCheckpointId },
        orderIndex: { gt: checkpoint.orderIndex },
      },
      orderBy: { orderIndex: "asc" },
      select: { id: true },
    });

    const nextCheckpointId = nextCheckpoint?.id ?? "";
    const finalScore = currentAccumulatedPoints + pointsAwarded;

    // 1. Update PlayAttempt checkpoint and score
    await prisma.playAttempt.update({
      where: { id: attemptIdToUpdate },
      data: {
        currentCheckpointId: nextCheckpointId || targetCheckpointId,
        currentCheckpointIndex: attempt.currentCheckpointIndex + 1,
        accumulatedPoints: finalScore,
      },
    });

    // 2. If finished, upsert ModuleCompletion record
    if (!nextCheckpointId) {
      const existingCompletion = await prisma.moduleCompletion.findFirst({
        where: { userId, moduleId },
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
            moduleId,
            highScore: finalScore,
            lastScore: finalScore,
            totalPlays: 1,
            lastPlayedAt: new Date(),
            lastPlayedVersionId: playId,
          },
        });
      }
    }

    const resData = {
      isCorrect,
      correctAnswer: checkpoint.correctAnswer,
      explanation: checkpoint.explanation,
      pointsAwarded,
      nextCheckpointId,
      moduleId,
    };

    return JSend.success(ZSim.SimCheckpointPostAnswer.shape.res.parse(resData));
  });
}
