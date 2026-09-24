import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

const ZGetRes = ZApp.AppUserGetProfileStats.shape.res;

export const GET = secureApiRoute(async () => {
  const stats = ZGetRes.parse({
    modulesCompleted: 18,
    averageScore: 100,
    bestScore: 200,
    bestScoreTopic: "Atomic Structure",
    currentStreak: 0,
    badgesEarned: 0,
  });

  return JSend.success(stats);
});
