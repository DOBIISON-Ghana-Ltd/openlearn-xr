import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

const ZGetRes = ZApp.AppUserGetProfileSubscription.shape.res;

export const GET = secureApiRoute(async () => {
  const subscription = ZGetRes.parse({
    currentPlan: "Free Plan",
    accountType: "Learner",
    memberSince: "Jan 20, 2024",
  });

  return JSend.success(subscription);
});
