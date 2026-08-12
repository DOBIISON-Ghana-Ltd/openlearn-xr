import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const params = await ctx.params;

  const item = await prisma.moduleVersion.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      module: {
        select: {
          title: true,
          duration: true,
          difficulty: true,
          image: true,
        },
      },
    },
  });

  if (!item) {
    return JSend.error("Module version not found", 404);
  }

  const parsedData = ZSes.SesModuleGetOne.shape.res.parse(item);
  return JSend.success(parsedData);
});
