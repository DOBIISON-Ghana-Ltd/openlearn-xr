import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { persistAttemptCompletion } from "@/lib/actions/persist-attempt-completion";
import { Infer } from "@/data/types.base";

type IAnswerBody = Infer["SimCheckpointPostAnswer"]["body"];

export async function handlePostSessionAnswer(playId: string, body: IAnswerBody) {
  const attempt = await prisma.playAttempt.findFirst({
    where: { sessionId: playId },
  });

  if (!attempt || !attempt.currentCheckpointId) {
    return JSend.error("Session play attempt not initialized. Please fetch checkpoint first", 404);
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

  let nextCheckpointId = "";
  const sessionCheckpoints = await prisma.sessionCheckpoint.findMany({
    where: { sessionId: playId, isEnabled: true },
    include: { checkpoint: true },
    orderBy: { checkpoint: { orderIndex: "asc" } },
  });

  const checkpoints = sessionCheckpoints.map((sc) => sc.checkpoint);
  const currentIdx = checkpoints.findIndex((c) => c.id === targetCheckpointId);

  if (currentIdx !== -1 && currentIdx < checkpoints.length - 1) {
    nextCheckpointId = checkpoints[currentIdx + 1].id;
  }

  const finalScore = currentAccumulatedPoints + pointsAwarded;

  if (!nextCheckpointId) {
    await persistAttemptCompletion({
      attemptId: attemptIdToUpdate,
      mode: "session",
      userId: null,
      playId,
      finalScore,
      sessionPlayerId: body.sessionPlayerId,
    });
  } else {
    await prisma.playAttempt.update({
      where: { id: attemptIdToUpdate },
      data: {
        currentCheckpointId: nextCheckpointId,
        accumulatedPoints: { increment: pointsAwarded },
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
