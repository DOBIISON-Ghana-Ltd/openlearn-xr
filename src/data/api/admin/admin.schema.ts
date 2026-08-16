import { z } from "zod";
import {
  ZApi,
  ZEmailLog,
  ZOrganization,
  ZRoleList,
  ZSubscription,
  ZUser,
} from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET /api/admin/users — list all users in admin panel
// ---------------------------------------------------------------------------
const AdminUserGetAll = ZApi({
  res: z.array(
    ZUser.pick({
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      onboarded: true,
      createdAt: true,
    })
  ),
});

// ---------------------------------------------------------------------------
// PATCH /api/admin/users/role — update user role
// ---------------------------------------------------------------------------
const AdminUserPatchRole = ZApi({
  body: z.object({
    userId: ZUser.shape.id,
    role: ZRoleList,
  }),
});

// ---------------------------------------------------------------------------
// GET /api/admin/email — email logs
// ---------------------------------------------------------------------------
const AdminEmailLogGetAll = ZApi({
  res: z.array(
    ZEmailLog.pick({
      id: true,
      to: true,
      subject: true,
      template: true,
      status: true,
      errorMsg: true,
      sentAt: true,
      createdAt: true,
    })
  ),
});

// ---------------------------------------------------------------------------
// GET /api/admin/subscriptions — subscriptions list
// ---------------------------------------------------------------------------
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
  AdminUserGetAll,
  AdminUserPatchRole,
  AdminEmailLogGetAll,
  AdminSubscriptionGetAll,
};

export default schema;
