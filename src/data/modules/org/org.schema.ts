import { z } from "zod";
import { ZApi, ZOrganization, ZSubscription, ZMember } from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET active org subscription
// ---------------------------------------------------------------------------
const PublicOrgGetSubscription = ZApi({
  params: z.object({ orgId: z.string() }),
  res: ZSubscription.nullable(),
});

// ---------------------------------------------------------------------------
// GET orgs the current user belongs to (list)
// ---------------------------------------------------------------------------
const PublicOrgGetList = ZApi({
  res: z.array(
    ZOrganization.extend({
      role: ZMember.shape.role,
    })
  ),
});

// ---------------------------------------------------------------------------
// POST create a new organization
// ---------------------------------------------------------------------------
const PublicOrgCreate = ZApi({
  body: ZOrganization.pick({ name: true }),
});

const schema = {
  PublicOrgGetSubscription,
  PublicOrgGetList,
  PublicOrgCreate,
};

export default schema;
