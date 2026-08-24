import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

const ZGetRes = ZSim.SimModuleGetSlug.shape.res;

export async function handleGetModuleSlug(id: string) {
  const moduleVersion = await prisma.moduleVersion.findUnique({
    where: { id },
    select: {
      module: {
        select: { slug: true, title: true },
      },
    },
  });

  if (!moduleVersion?.module) {
    return JSend.error("Module version not found", 404);
  }

  const resData = {
    title: moduleVersion.module.title,
    slug: moduleVersion.module.slug,
  };

  return JSend.success(ZGetRes.parse(resData));
}
