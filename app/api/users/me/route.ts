import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

export const GET = secureApiRoute(async (req, ctx, user) => {
  return JSend.success({
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    image: user.image,
    avatar: user.avatar,
    onboarded: user.onboarded,
    createdAt: user.createdAt
  });
});

export const PATCH = secureApiRoute(async (req, ctx, user) => {
  return JSend.success("User updated successfully");
});

export const DELETE = secureApiRoute(async (req, ctx, user) => {
  return JSend.success("User deleted successfully");
});