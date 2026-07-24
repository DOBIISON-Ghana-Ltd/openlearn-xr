import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import { dummySessions } from "@/lib/constants/dummy-sessions";

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error(
      "No active organization found. Please switch to or create an organization.",
      404
    );
  }

  const parsedData = ZSes.SesSessionGetAll.shape.res.parse(dummySessions);
  return JSend.success(parsedData);
});

export const POST = secureApiRoute(async (req, ctx, user, session) => {
  if (!session.activeOrganizationId) {
    return JSend.error("No active organization found.", 404);
  }

  const rawBody = await req.json();
  const body = ZSes.SesSessionPostCreate.shape.body.parse(rawBody);

  const mockId = `session-${Math.random().toString(36).substring(2, 9)}`;
  const mockCreated = { id: mockId };

  const parsedData = ZSes.SesSessionPostCreate.shape.res.parse(mockCreated);
  return JSend.success(parsedData);
});
