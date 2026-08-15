import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;

  const collection = await prisma.collection.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      grade: true,
    },
  });

  if (!collection) {
    return JSend.error("Collection not found", 404);
  }

  const moduleVersions = await prisma.moduleVersion.findMany({
    where: {
      status: { in: ["DRAFT", "PUBLISHED"] },
      module: {
        collectionId: id,
      },
    },
    select: {
      id: true,
      module: {
        select: {
          title: true,
          image: true,
          duration: true,
          difficulty: true,
          collection: {
            select: {
              name: true,
              grade: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedData = ZSim.SimCollectionGetModules.shape.res.parse({
    ...collection,
    modules: moduleVersions,
  });

  return JSend.success(parsedData);
});
