import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";
import { clearSessionCache } from "@/lib/actions/clear-session-cache";

const ZGetRes = ZApp.AppOnboardingGetHasLicense.shape.res;

export const GET = secureApiRoute(async (req, ctx, user) => {

  // check if org id has active subscription then 
  //    set onboarded to true 
  //    reset cookie 
  //    send flag to say true

  // OUTPUT
  //    hasLisense

  const parsed = ZGetRes.parse(null);

  return JSend.success(parsed);
});
