import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";

const ZPatchBody = ZApp.AppOnboardingPatchJoin.shape.body;

export const PATCH = secureApiRoute(async (req, ctx, user) => {
  const body = await req.json();
  const validated = ZPatchBody.parse(body);

  // INPUT

  // add [organizationCode] to organizationi table or explore using the invitation table to do this
  // verify the unique code isame for the input orgCode
  // add user to member table of organization
  //    set onboarded to true 
  //    reset cookie 
  //    send flag to say true

  // OUTPUT
  //    string: success

  return JSend.success("Joined organization successfully");
});
