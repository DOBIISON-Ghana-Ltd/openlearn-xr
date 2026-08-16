import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const params = await ctx.params;
  const parsedParams = ZSes.SesSessionGetOne.shape.params.parse({ code: params.id });

  const item = await prisma.liveSession.findUnique({
    where: { joinCode: parsedParams.code },
    select: {
      id: true,
      name: true,
      status: true,
      config: true,
      players: {
        select: {
          id: true,
          name: true,
          avatar: true,
          joinedAt: true,
        },
        orderBy: {
          joinedAt: "desc",
        },
      },
    },
  });

  if (!item) {
    return JSend.error("Live session not found", 404);
  }

  const parsedData = ZSes.SesSessionGetOne.shape.res.parse(item);
  return JSend.success(parsedData);
});
