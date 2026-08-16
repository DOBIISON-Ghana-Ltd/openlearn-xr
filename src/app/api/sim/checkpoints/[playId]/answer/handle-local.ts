import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { Infer } from "@/data/types.base";

type IAnswerBody = Infer["SimCheckpointPostAnswer"]["body"];

export async function handlePostLocalAnswer(playId: string, body: IAnswerBody) {
  if (!body.checkpointId) {
    return JSend.error("checkpointId is required in body for local mode", 400);
  }

  const targetCheckpointId = body.checkpointId;

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
