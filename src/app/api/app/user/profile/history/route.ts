import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

const ZGetRes = ZApp.AppUserGetProfileHistory.shape.res;

export const GET = secureApiRoute(async () => {
  const history = ZGetRes.parse([
    {
      id: "hist_1",
      title: "Atomic Structure Lab",
      score: 100,
      completedAt: "2024-01-20T10:00:00Z",
    },
  ]);

  return JSend.success(history);
});
