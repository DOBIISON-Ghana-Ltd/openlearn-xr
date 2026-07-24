import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import { dummySessions } from "@/lib/constants/dummy-sessions";

export const GET = secureApiRoute<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const id = params?.id;

  if (!id) {
    return JSend.error("Session ID is required.", 400);
  }

  const session = dummySessions.find((s) => s.id === id);

  if (!session) {
    return JSend.error("Session not found.", 404);
  }

  const parsedData = ZSes.SesSessionGetOverview.shape.res.parse(session);
  return JSend.success(parsedData);
});
