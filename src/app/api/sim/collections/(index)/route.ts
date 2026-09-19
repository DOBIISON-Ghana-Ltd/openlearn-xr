import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { apiHandler } from "@/lib/utils/api-handler";

const ZGetRes = ZSim.SimCollectionGetAll.shape.res;

export const GET = apiHandler(async (req) => {
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      name: true,
      grade: true,
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

  const parsedData = ZGetRes.parse(collections);
  return JSend.success(parsedData);
});
