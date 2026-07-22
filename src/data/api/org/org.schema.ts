import { z } from "zod";
import { ZApi, ZOrganization, ZSubscription, ZMember, ZUser } from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET active org subscription
// ---------------------------------------------------------------------------
const PublicOrgGetSubscription = ZApi({
  params: z.object({ orgId: z.string() }),
  res: ZSubscription.pick({
    id: true,
    status: true,
    seats: true,
    isUnlimited: true,
    currentPeriodEnd: true,
  }),
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

// ---------------------------------------------------------------------------
// PATCH update active organization logo and name
// ---------------------------------------------------------------------------
const PublicOrgUpdateActive = ZApi({
  body: ZOrganization.pick({
    name: true,
  }).extend({
    logo: ZOrganization.shape.logo.unwrap(),
  })
});

// ---------------------------------------------------------------------------
// GET all organization members
// ---------------------------------------------------------------------------
const PublicOrgGetMembers = ZApi({
  params: z.object({ orgId: z.string() }),
  res: z.array(
    ZMember.pick({ id: true, role: true, createdAt: true }).extend({
      user: ZUser.pick({ id: true, name: true, email: true, image: true }),
    })
  ),
});

// ---------------------------------------------------------------------------
// DELETE remove organization member
// ---------------------------------------------------------------------------
const PublicOrgDeleteMember = ZApi({
  params: z.object({ orgId: z.string() }),
  body: ZMember.pick({ id: true }),
});

// ---------------------------------------------------------------------------
// PATCH update member role
// ---------------------------------------------------------------------------
const PublicOrgUpdateMemberRole = ZApi({
  params: z.object({ orgId: z.string() }),
  body: ZMember.pick({ id: true, role: true }),
});

// ---------------------------------------------------------------------------
// POST invite member
// ---------------------------------------------------------------------------
const PublicOrgInviteMember = ZApi({
  params: z.object({ orgId: z.string() }),
  body: z.object({
    email: z.email(),
    role: ZMember.shape.role.default("member"),
  }),
});

const AdminSubscriptionGetAll = ZApi({
  res: z.array(
    ZSubscription.pick({
      id: true,
      organizationId: true,
      tier: true,
      status: true,
      seats: true,
      isUnlimited: true,
      currentPeriodEnd: true,
      createdAt: true,
    }).extend({
      organization: ZOrganization.pick({
        id: true,
        name: true,
        logo: true,
      }),
    })
  ),
});

const schema = {
  PublicOrgGetSubscription,
  PublicOrgGetList,
  PublicOrgCreate,
  PublicOrgGetActive,
  PublicOrgSetActive,
  PublicOrgUpdateActive,
  PublicOrgGetMembers,
  PublicOrgDeleteMember,
  PublicOrgUpdateMemberRole,
  PublicOrgInviteMember,
  AdminSubscriptionGetAll,
};

export default schema;
