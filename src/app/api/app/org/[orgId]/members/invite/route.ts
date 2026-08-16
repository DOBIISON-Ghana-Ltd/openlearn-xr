import { NextRequest } from "next/server";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

export const POST = secureApiRoute(async (req: NextRequest, ctx, user) => {
  return JSend.success("Invite sent (stub — not yet implemented)");
});
