import fetcher, { ApiError } from "@/data/fetcher";
import { axios } from "@/data/axios";
import R from "@/data/route-factory";
import { QueryConfig, MutationConfig, Infer } from "@/data/types.base";
import ZOrg from "./org.schema";
import { QUERY_KEYS } from "@/data/key-factory";
import { authClient } from "@/adapters/auth/client";
import { getUniqueSlug } from "@/lib/utils/get-unique-slug";

// ---------------------------------------------------------------------------
// GET /api/org/:orgId/subscription
// ---------------------------------------------------------------------------
const publicGetSubscription = {
  type: "query",
  queryKey: (orgId: string) => ["public", "org", orgId, "subscription"],
  queryFn: async (orgId: string) => {
    const data = await fetcher(
      () => axios.get(R["public:org:get:subscription"]({ orgId })),
      ZOrg.PublicOrgGetSubscription.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

// ---------------------------------------------------------------------------
// POST /api/org  — create a new organization
// ---------------------------------------------------------------------------
const publicCreateOne = {
  type: "mutation",
  mutationFn: async (body: Infer["PublicOrgCreate"]["body"]) => {
    const slug = getUniqueSlug(body.name);
    const res = await authClient.organization.create({
      name: body.name,
      slug,
    });
    if (res.error) {
      throw new ApiError(res.error.message || "Failed to create organization", 400);
    }

    // Automatically set the new organization as active
    const activeRes = await authClient.organization.setActive({
      organizationId: res.data.id
    });
    if (activeRes.error) {
      throw new ApiError(activeRes.error.message || "Failed to set active organization", 400);
    }

    return "Organization created successfully";
  },
} satisfies MutationConfig;

// ---------------------------------------------------------------------------
// GET /api/org/active  — get the active organization info
// ---------------------------------------------------------------------------
const publicGetActive = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:org:get:active"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["public:org:get:active"]()),
      ZOrg.PublicOrgGetActive.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

// ---------------------------------------------------------------------------
// GET (list of user's organizations)
// ---------------------------------------------------------------------------
const publicGetList = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:org:get:all"]],
  queryFn: async () => {
    const res = await authClient.organization.list();
    if (res.error) {
      throw new ApiError(res.error.message || "Failed to fetch organizations", 400);
    }
    return ZOrg.PublicOrgGetList.shape.res.parse(res.data);
  },
} satisfies QueryConfig;

// ---------------------------------------------------------------------------
// PATCH active organization
// ---------------------------------------------------------------------------
const publicSetActive = {
  type: "mutation",
  mutationFn: async (body: Infer["PublicOrgSetActive"]["body"]) => {
    const res = await authClient.organization.setActive({
      organizationId: body.id
    });

    if (res.error) {
      throw new ApiError(res.error.message || "Failed to set active organization", 400);
    }
    return "Organization set as active successfully";
  },
} satisfies MutationConfig;

export default {
  "public:org:get:subscription": publicGetSubscription,
  "public:org:post:create": publicCreateOne,
  "public:org:get:active": publicGetActive,
  "public:org:get:all": publicGetList,
  "public:org:patch:active": publicSetActive,
};
