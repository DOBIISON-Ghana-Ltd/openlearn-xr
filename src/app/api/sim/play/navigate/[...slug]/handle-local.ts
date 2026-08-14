import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetLocalNav(playId: string) {
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
    currentTab: 0,
    progress: 0,
    totalCheckpoints,
    checkpointId: firstCheckpoint?.id ?? null,
  };

  return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse(resData));
}

export async function handlePostLocalNav() {
  return JSend.error("Local navigation is handled client-side.", 400);
}
