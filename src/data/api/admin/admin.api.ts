import fetcher, { ApiError } from "@/data/fetcher";
import { axios } from "@/data/axios";
import { QueryConfig, MutationConfig, Infer } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZAdmin from "./admin.schema";
import { authClient } from "@/adapters/auth/client";

const adminUserGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["admin:user:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["admin:user:get:all"]()),
      ZAdmin.AdminUserGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const adminUserPatchRole = {
  type: "mutation",
  mutationFn: async (body: Infer["AdminUserPatchRole"]["body"]) => {
    const roleValue = body.role.join(",");
    const res = await authClient.admin.setRole({
      userId: body.userId,
      role: roleValue as any,
    });
    if (res.error) {
      throw new ApiError(
        res.error.message || "Failed to update user role",
        400
      );
    }
    return "User role updated successfully.";
  },
} satisfies MutationConfig;

const adminEmailLogGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["admin:email-log:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["admin:email-log:get:all"]()),
      ZAdmin.AdminEmailLogGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const adminSubscriptionGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["admin:subscription:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["admin:subscription:get:all"]()),
      ZAdmin.AdminSubscriptionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

export default {
  "admin:user:get:all": adminUserGetAll,
  "admin:user:patch:role": adminUserPatchRole,
  "admin:email-log:get:all": adminEmailLogGetAll,
  "admin:subscription:get:all": adminSubscriptionGetAll,
};
