import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";

export const GET = secureApiRoute(async () => {
  const versions = await prisma.moduleVersion.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      versionNumber: true,
      module: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const parsedData = ZSes.SesModuleVersionGetOptions.shape.res.parse(versions);
  return JSend.success(parsedData);
});
