import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetModuleVersion(id: string) {
  const moduleVersion = await prisma.moduleVersion.findUnique({
    where: { id },
    select: {
      notes: true,
      module: {
        select: {
          title: true,
          duration: true,
          difficulty: true,
          description: true,
          collection: {
            select: {
              name: true,
              grade: true,
            },
          },
        },
      },
    },
  });

  if (!moduleVersion) {
    return JSend.error("Module version not found", 404);
  }

  const parsedData = ZSim.SimModuleGetOne.shape.res.parse(moduleVersion);
  return JSend.success(parsedData);
}
