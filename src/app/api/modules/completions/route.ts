import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZModules from "@/data/api/modules/modules.schema";

export const GET = secureApiRoute(async (req, ctx, user) => {
  const completions = await prisma.moduleCompletion.findMany({
    where: { userId: user.id },
    include: {
      module: {
        include: {
          collection: true,
        },
      },
      lastPlayedVersion: true,
    },
    orderBy: {
      lastPlayedAt: "desc",
    },
  });

  const parsedData = ZModules.PublicModuleCompletionGetAll.shape.res.parse(completions);

  return JSend.success(parsedData);
});
