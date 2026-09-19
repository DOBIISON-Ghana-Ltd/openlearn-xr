import prisma from "@/adapters/db/client";
import ZAdmin from "@/data/api/admin/admin.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

const ZGetRes = ZAdmin.AdminUserGetAll.shape.res;

export const GET = secureApiRoute(async (req, ctx, user) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      image: true,
      onboarded: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsed = ZGetRes.parse(users);

  return JSend.success(parsed);
});