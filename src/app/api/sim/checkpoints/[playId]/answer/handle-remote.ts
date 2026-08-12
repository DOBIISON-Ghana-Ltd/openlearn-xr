import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { persistAttemptCompletion } from "@/lib/actions/persist-attempt-completion";
import { Infer } from "@/data/types.base";

type IAnswerBody = Infer["SimCheckpointPostAnswer"]["body"];

export function handlePostRemoteAnswer(playId: string, body: IAnswerBody) {
  return secureApiRoute<{ playId: string }>(async (req, ctx, user) => {
    const userId = user.id;

    const attempt = await prisma.playAttempt.findFirst({
      where: { userId, moduleVersionId: playId, playMode: "module" },
    });

    if (!attempt || !attempt.currentCheckpointId) {
      return JSend.error("Play attempt not initialized. Please fetch checkpoint first", 404);
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
    const checkpoints = await prisma.moduleCheckpoint.findMany({
      where: { moduleVersionId: checkpoint.moduleVersionId },
      orderBy: { orderIndex: "asc" },
    });

    const currentIdx = checkpoints.findIndex((c) => c.id === targetCheckpointId);

    if (currentIdx !== -1 && currentIdx < checkpoints.length - 1) {
      nextCheckpointId = checkpoints[currentIdx + 1].id;
    }

    const finalScore = currentAccumulatedPoints + pointsAwarded;

    if (!nextCheckpointId) {
      await persistAttemptCompletion({
        attemptId: attemptIdToUpdate,
        mode: "remote",
        userId,
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
  });
}
