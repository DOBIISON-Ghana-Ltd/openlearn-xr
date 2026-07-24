import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = secureApiRoute(async () => {
  const versions = await prisma.moduleVersion.findMany({
    where: { status: "PUBLISHED" },
    include: { module: true },
    orderBy: { createdAt: "desc" },
  });

  const parsedData = ZSim.SimModuleVersionGetOptions.shape.res.parse(versions);
  return JSend.success(parsedData);
});
