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
  res: ZOrganization.pick({
    id: true,
    name: true,
    logo: true
  }).array()
});

// ---------------------------------------------------------------------------
// POST create a new organization
// ---------------------------------------------------------------------------
const PublicOrgCreate = ZApi({
  body: ZOrganization.pick({ name: true }),
});

// ---------------------------------------------------------------------------
// GET active organization info for current session
// ---------------------------------------------------------------------------
const PublicOrgGetActive = ZApi({
  res: ZOrganization.pick({
    id: true,
    name: true,
    logo: true,
  }).extend({
    subscriptionTier: z.string(),
  }),
});

// ---------------------------------------------------------------------------
// PATCH active organization
// ---------------------------------------------------------------------------
const PublicOrgSetActive = ZApi({
  body: ZOrganization.pick({
    id: true
  })
});

const schema = {
  PublicOrgGetSubscription,
  PublicOrgGetList,
  PublicOrgCreate,
  PublicOrgGetActive,
  PublicOrgSetActive,
};

export default schema;
