import { NextRequest } from "next/server";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { authClient } from "@/adapters/auth/client";
import { ZOrganization } from "@/data/schema.base";
import { auth } from "@/adapters/auth/server";
import { headers } from "next/headers";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

// POST /api/org  — create a new organization
export const POST = secureApiRoute(async (req: NextRequest, _ctx, _user) => {
  const body = await req.json();

  const parsed = ZOrganization.pick({ name: true }).safeParse(body);
  if (!parsed.success) {
    return JSend.error(parsed.error.name, 400);
  }

  const baseSlug = slugify(parsed.data.name);
  const uniqueSlug = `${baseSlug}-${nanoid(6)}`;
  const result = await auth.api.createOrganization({
    headers: await headers(),
    body: {
      name: parsed.data.name,
      slug: uniqueSlug,
    },
  });

  if (!result) {
    return JSend.error("Failed to create organization", 500);
  }

  return JSend.success(result);
});
