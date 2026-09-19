import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

const ZPostBody = ZSim.SimSessionAnalyticsPostOne.shape.body;
const ZPostRes = ZSim.SimSessionAnalyticsPostOne.shape.res;

export const POST = apiHandler(async (req) => {
  const body = ZPostBody.parse(await req.json());

  const created = await prisma.sessionAnalytic.create({
    data: {
      sessionId: body.sessionId,
      playerId: body.playerId,
      event: body.event,
      payload: body.payload,
    },
  });

  const parsedData = ZPostRes.parse(created);
  return JSend.success(parsedData);
});
