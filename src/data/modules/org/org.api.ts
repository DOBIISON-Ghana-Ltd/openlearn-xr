import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import R from "@/data/route-factory";
import { QueryConfig, MutationConfig } from "@/data/types.base";
import ZOrg from "./org.schema";
import { z } from "zod";

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
} satisfies QueryConfig<
  z.infer<typeof ZOrg.PublicOrgGetSubscription.shape.res>,
  string
>;

// ---------------------------------------------------------------------------
// POST /api/org  — create a new organization
// ---------------------------------------------------------------------------
const publicCreateOrg = {
  type: "mutation",
  mutationFn: async (body: z.infer<typeof ZOrg.PublicOrgCreate.shape.body>) => {
    const data = await fetcher(
      () => axios.post(R["public:org:post:create"](), body),
      ZOrg.PublicOrgCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig<
  z.infer<typeof ZOrg.PublicOrgCreate.shape.res>,
  z.infer<typeof ZOrg.PublicOrgCreate.shape.body>
>;

export default {
  "public:org:get:subscription": publicGetSubscription,
  "public:org:post:create": publicCreateOrg,
};
