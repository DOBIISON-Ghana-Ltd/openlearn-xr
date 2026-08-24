import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

const ZGetParams = ZSim.SimModuleGetStats.shape.params;
const ZGetRes = ZSim.SimModuleGetStats.shape.res;

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { id } = ZGetParams.parse(params);

  const moduleVersion = await prisma.moduleVersion.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      module: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!moduleVersion) {
    return JSend.error("Module version not found", 404);
  }

  const parsedData = ZGetRes.parse(moduleVersion);

  return JSend.success(parsedData);
});
