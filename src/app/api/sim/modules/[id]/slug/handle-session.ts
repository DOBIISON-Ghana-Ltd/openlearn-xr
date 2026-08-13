import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetSessionSlug(id: string) {
  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: id },
    select: {
      moduleVersion: {
        select: {
          module: {
            select: { slug: true, title: true },
          },
        },
      },
    },
  });

  if (!liveSession?.moduleVersion?.module) {
    return JSend.error("Live session module not found", 404);
  }

  const resData = {
    title: liveSession.moduleVersion.module.title,
    slug: liveSession.moduleVersion.module.slug,
  };

  return JSend.success(ZSim.SimModuleGetSlug.shape.res.parse(resData));
}
