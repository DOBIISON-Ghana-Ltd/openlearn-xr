import prisma from "@/adapters/db/client";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

export const GET = secureApiRoute(async (req, ctx, user) => {
  
  const res = prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      image: true,
      onboarded: true,
      metadata: true
    }
  });
  
  return JSend.success(res);
});