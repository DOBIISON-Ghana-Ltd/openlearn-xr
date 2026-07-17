import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSession from "@/data/api/session/session.schema";
import { dummySessions } from "@/lib/constants/dummy-sessions";

export const GET = secureApiRoute<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const id = params?.id;

  if (!id) {
    return JSend.error("Session ID is required.", 400);
  }

  // Find the dummy session by id
  const session = dummySessions.find((s) => s.id === id);

  if (!session) {
    return JSend.error("Session not found.", 404);
  }

  // Parse the dummy session matching the Zod schema
  const parsedData = ZSession.PublicSessionGetOverview.shape.res.parse(session);
  return JSend.success(parsedData);
});
