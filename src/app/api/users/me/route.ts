import ZUser from "@/data/api/user/user.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { getActiveOrgSubscription } from "@/lib/actions/get-active-org-subscription";

export const GET = secureApiRoute(async (req, ctx, user, session) => {
  const subscriptionTier = await getActiveOrgSubscription(session.activeOrganizationId);

  const res = ZUser.PublicUserGetMe.shape.res.parse({
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    image: user.image,
    onboarded: user.onboarded,
    createdAt: user.createdAt.toISOString(),
    activeOrganizationId: session.activeOrganizationId,
    subscriptionTier
  });

  return JSend.success(res);
});

export const PATCH = secureApiRoute(async (req, ctx, user) => {
  return JSend.success("User updated successfully");
});

export const DELETE = secureApiRoute(async (req, ctx, user) => {
  return JSend.success("User deleted successfully");
});
