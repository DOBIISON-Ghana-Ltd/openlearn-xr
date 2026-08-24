import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

const ZPostRes = ZSim.SimGeneralPostRetake.shape.res;

export async function handlePostLocalRetake(playId: string) {
  const [firstCheckpoint, totalCheckpoints] = await prisma.$transaction([
    prisma.moduleCheckpoint.findFirst({
      where: { moduleVersionId: playId },
      orderBy: { orderIndex: "asc" },
      select: { id: true },
    }),
    prisma.moduleCheckpoint.count({
      where: { moduleVersionId: playId },
    }),
  ]);

  const resData = {
    checkpointId: firstCheckpoint?.id ?? null,
    totalCheckpoints,
  };

  return JSend.success(ZPostRes.parse(resData));
}
