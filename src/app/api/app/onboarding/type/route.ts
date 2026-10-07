import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";

const ZGetRes = ZApp.AppOnboardingGetType.shape.res;

export const GET = secureApiRoute(async (req, ctx, user) => {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { type: true },
  });

  const parsed = ZGetRes.parse(dbUser);

  return JSend.success(parsed);
});

const ZPatchBody = ZApp.AppOnboardingPatchType.shape.body;

export const PATCH = secureApiRoute(async (req, ctx, user) => {
  const body = await req.json();
  const validated = ZPatchBody.parse(body);

  await prisma.user.update({
    where: { id: user.id },
    data: { type: validated.type },
  });

  return JSend.success("User type updated successfully");
});
