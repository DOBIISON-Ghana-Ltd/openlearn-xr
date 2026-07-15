import { NextRequest } from "next/server";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";
import ZOrg from "@/data/api/org/org.schema";

// ---------------------------------------------------------------------------
// GET /api/org/:orgId/members
// Returns all members of the org with their user details.
// ---------------------------------------------------------------------------
export const GET = secureApiRoute(async (req: NextRequest, ctx, user) => {
  const { orgId } = await ctx.params as { orgId: string };

  // Verify the caller belongs to this org
  const callerMember = await prisma.member.findFirst({
    where: { userId: user.id, organizationId: orgId },
  });
  if (!callerMember) return JSend.error("Forbidden", 403);

  const members = await prisma.member.findMany({
    where: { organizationId: orgId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const parsed = ZOrg.PublicOrgGetMembers.shape.res.parse(
    members.map((m) => ({
      id: m.id,
      role: m.role,
      createdAt: m.createdAt.toISOString(),
      user: m.user,
    }))
  );

  return JSend.success(parsed);
});

// ---------------------------------------------------------------------------
// DELETE /api/org/:orgId/members
// Removes a member from the org. Only owners can do this; cannot self-remove.
// ---------------------------------------------------------------------------
export const DELETE = secureApiRoute(async (req: NextRequest, ctx, user) => {
  const { orgId } = await ctx.params as { orgId: string };
  const body = ZOrg.PublicOrgDeleteMember.shape.body.parse(await req.json());

  // Verify caller is an owner
  const callerMember = await prisma.member.findFirst({
    where: { userId: user.id, organizationId: orgId, role: "owner" },
  });
  if (!callerMember) return JSend.error("Forbidden: only owners can remove members", 403);

  // Fetch target member to validate it exists and isn't the caller
  const target = await prisma.member.findUnique({ where: { id: body.id } });
  if (!target) return JSend.error("Member not found", 404);
  if (target.userId === user.id) return JSend.error("You cannot remove yourself", 400);

  await prisma.member.delete({ where: { id: body.id } });

  return JSend.success("Member removed successfully");
});
