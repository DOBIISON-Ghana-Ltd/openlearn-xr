import { NextRequest } from "next/server";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";
import ZOrg from "@/data/api/org/org.schema";

// ---------------------------------------------------------------------------
// PATCH /api/org/:orgId/members/role
// Assigns a new role to a member. Only owners can do this; cannot change own role.
// ---------------------------------------------------------------------------
export const PATCH = secureApiRoute(async (req: NextRequest, ctx, user) => {
  const { orgId } = await ctx.params as { orgId: string };
  const body = ZOrg.PublicOrgUpdateMemberRole.shape.body.parse(await req.json());

  // Verify caller is an owner
  const callerMember = await prisma.member.findFirst({
    where: { userId: user.id, organizationId: orgId, role: "owner" },
  });
  if (!callerMember) return JSend.error("Forbidden: only owners can change roles", 403);

  // Fetch target to validate existence and prevent self-update
  const target = await prisma.member.findUnique({ where: { id: body.id } });
  if (!target) return JSend.error("Member not found", 404);
  if (target.userId === user.id) return JSend.error("You cannot change your own role", 400);

  await prisma.member.update({
    where: { id: body.id },
    data: { role: body.role },
  });

  return JSend.success("Member role updated successfully");
});
