import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { Infer } from "@/data/types.base";

type IAnswerBody = Infer["SimCheckpointPostAnswer"]["body"];

export async function handlePostSessionAnswer(playId: string, body: IAnswerBody) {
  if (!body.sessionPlayerId) {
    return JSend.error("Session player ID is required.", 400);
  }

  const attempt = await prisma.playAttempt.findUnique({
    where: { sessionPlayerId: body.sessionPlayerId },
  });

  if (!attempt || !attempt.currentCheckpointId) {
    return JSend.error("Session play attempt not initialized.", 404);
  }

  const targetCheckpointId = attempt.currentCheckpointId;
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

  const nextSessionCheckpoint = await prisma.sessionCheckpoint.findFirst({
    where: {
      sessionId: playId,
      isEnabled: true,
      checkpointId: { not: targetCheckpointId },
      checkpoint: { orderIndex: { gt: checkpoint.orderIndex } },
    },
    include: { checkpoint: true },
    orderBy: { checkpoint: { orderIndex: "asc" } },
  });

  const nextCheckpointId = nextSessionCheckpoint?.checkpointId ?? "";
  const finalScore = currentAccumulatedPoints + pointsAwarded;

  // 1. Update PlayAttempt checkpoint and score
  await prisma.playAttempt.update({
    where: { id: attempt.id },
    data: {
      currentCheckpointId: nextCheckpointId || null,
      accumulatedPoints: finalScore,
    },
  });

  // 2. If finished, mark SessionPlayer completed
  if (!nextCheckpointId) {
    await prisma.sessionPlayer.update({
      where: { id: body.sessionPlayerId },
      data: {
        score: finalScore,
        completedAt: new Date(),
      },
    });
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
}
