import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(async (req) => {
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      name: true,
      level: true,
      _count: {
        select: {
          modules: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const parsedData = ZSim.SimCollectionGetAll.shape.res.parse(collections);
  return JSend.success(parsedData);
});
