import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetLocalCheckpoint(checkpointId?: string) {
  const activeCheckpoint = await prisma.moduleCheckpoint.findUnique({
    where: { id: checkpointId || "" },
  });

  if (!activeCheckpoint) {
    return JSend.error("Checkpoint not found", 404);
  }

  const resData = {
    checkpoint: {
      question: activeCheckpoint.question,
      options: activeCheckpoint.options,
      points: activeCheckpoint.points,
      orderIndex: activeCheckpoint.orderIndex,
      hint: activeCheckpoint.hint,
    },
  };

  return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
}
