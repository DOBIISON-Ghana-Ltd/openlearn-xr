import prisma from "@/adapters/db/client";
import ZAdmin from "@/data/api/admin/admin.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

export const GET = secureApiRoute(async (req, ctx, user) => {
  const logs = await prisma.emailLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsed = ZAdmin.AdminEmailLogGetAll.shape.res.parse(logs);

  return JSend.success(parsed);
});
