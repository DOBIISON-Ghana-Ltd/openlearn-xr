import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { id } = ZSim.SimModuleGetOne.shape.params.parse(params);
  const searchParams = ZSim.SimModuleGetOne.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  let targetModuleVersionId = id;

  if (searchParams.mode === "session") {
    const liveSession = await prisma.liveSession.findUnique({
      where: { id },
      select: { moduleVersionId: true },
    });

    if (!liveSession) {
      return JSend.error("Live session not found", 404);
    }

    targetModuleVersionId = liveSession.moduleVersionId;
  }

  const moduleVersion = await prisma.moduleVersion.findUnique({
    where: { id: targetModuleVersionId },
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
});
