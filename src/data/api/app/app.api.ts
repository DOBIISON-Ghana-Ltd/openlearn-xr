import fetcher, { ApiError } from "@/data/fetcher";
import { axios } from "@/data/axios";
import R from "@/data/route-factory";
import { Infer, MutationConfig, QueryConfig } from "@/data/types.base";
import ZApp from "./app.schema";
import { authClient } from "@/adapters/auth/client";
import { PATHS } from "@/lib/constants/paths";
import { QUERY_KEYS } from "@/data/key-factory";
import { getUniqueSlug } from "@/lib/utils/get-unique-slug";

// ---------------------------------------------------------------------------
// USER ENDPOINTS
// ---------------------------------------------------------------------------

const appUserGetMe = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["app:user:get:me"]],
  queryFn: async () => {
    const res = await fetcher(
      () => axios.get(R["app:user:get:me"]()),
      ZApp.AppUserGetMe.shape.res
    );
    return res;
  },
  options: {
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchIntervalInBackground: true,
  },
} satisfies QueryConfig;

const appUserDeleteMe = {
  type: "mutation",
  mutationFn: async () => {
    const data = await fetcher(
      () => axios.delete(R["app:user:delete:me"]()),
      ZApp.AppUserDeleteMe.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const appUserPatchOnboarding = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserPatchOnboarding"]["body"]) => {
    const data = await fetcher(
      () => axios.patch(R["app:user:patch:onboarding"](), body),
      ZApp.AppUserPatchOnboarding.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const appUserRegister = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserRegister"]["body"]) => {
    const { error } = await authClient.signUp.email({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    if (error)
      throw new ApiError(
        error.message || "Registration failed",
        error.status || 400
      );
    return "User registered successfully.";
  },
} satisfies MutationConfig;

const appUserLogin = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserLogin"]["body"]) => {
    const { error } = await authClient.signIn.email({
      email: body.email,
      password: body.password,
      callbackURL: body.redirect || PATHS.SIMS.DASHBOARD,
    });
    if (error)
      throw new ApiError(
        error.message || "Login failed",
        error.status || 400
      );

    return "User logged in successfully.";
  },
} satisfies MutationConfig;

const appUserLogout = {
  type: "mutation",
  mutationFn: async () => {
    const { error } = await authClient.signOut();
    if (error) throw new Error(error.message);

    return "User logged out successfully.";
  },
} satisfies MutationConfig;

const appUserCheckOtp = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserCheckOtp"]["body"]) => {
    const { error } = await authClient.emailOtp.checkVerificationOtp({
      email: body.email,
      type: body.type,
      otp: body.otp,
    });

    if (error)
      throw new ApiError(
        error.message ?? "OTP invalid",
        error.status ?? 500
      );

    return "OTP verified successfully.";
  },
} satisfies MutationConfig;

const appUserVerifyEmailOtp = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserVerifyEmailOtp"]["body"]) => {
    const { error } = await authClient.emailOtp.verifyEmail({
      email: body.email,
      otp: body.otp,
    });

    if (error)
      throw new ApiError(
        error.message ?? "Failed to verify OTP",
        error.status ?? 500
      );

    return "Email verified successfully.";
  },
} satisfies MutationConfig;

const appUserSendOtp = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserSendOtp"]["body"]) => {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: body.email,
      type: body.type,
    });

    if (error)
      throw new ApiError(
        error.message ?? "Failed to send OTP",
        error.status ?? 500
      );

    return "OTP sent successfully.";
  },
} satisfies MutationConfig;

const appUserResetPassword = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserResetPassword"]["body"]) => {
    const { error } = await authClient.emailOtp.resetPassword({
      email: body.email,
      password: body.newPassword,
      otp: body.otp,
    });

    if (error)
      throw new ApiError(
        error.message ?? "Password reset failed",
        error.status ?? 500
      );

    return "Password reset successfully.";
  },
} satisfies MutationConfig;

const appUserUpdateAccount = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserUpdateAccount"]["body"]) => {
    const res = await authClient.updateUser({
      name: body.name,
      image: body.image || undefined,
    });
    if (res.error) {
      throw new ApiError(res.error.message || "Failed to update account", 400);
    }
    return "Account updated successfully.";
  },
} satisfies MutationConfig;

const appUserUpdatePassword = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserUpdatePassword"]["body"]) => {
    const res = await authClient.changePassword({
      currentPassword: body.oldPassword,
      newPassword: body.newPassword,
    });
    if (res.error) {
      throw new ApiError(res.error.message || "Failed to update password", 400);
    }
    return "Password updated successfully.";
  },
} satisfies MutationConfig;

// ---------------------------------------------------------------------------
// ORGANIZATION ENDPOINTS
// ---------------------------------------------------------------------------

const appOrgGetSubscription = {
  type: "query",
  queryKey: (orgId: string) => [...QUERY_KEYS["app:org:get:subscription"](orgId)],
  queryFn: async (orgId: string) => {
    const data = await fetcher(
      () => axios.get(R["app:org:get:subscription"]({ orgId })),
      ZApp.AppOrgGetSubscription.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const appOrgCreate = {
  type: "mutation",
  mutationFn: async (body: Infer["AppOrgCreate"]["body"]) => {
    const slug = getUniqueSlug(body.name);
    const res = await authClient.organization.create({
      name: body.name,
      slug,
    });
    if (res.error) {
      throw new ApiError(
        res.error.message || "Failed to create organization",
        400
      );
    }

    const activeRes = await authClient.organization.setActive({
      organizationId: res.data.id,
    });
    if (activeRes.error) {
      throw new ApiError(
        activeRes.error.message || "Failed to set active organization",
        400
      );
    }

    return "Organization created successfully";
  },
} satisfies MutationConfig;

const appOrgGetActive = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["app:org:get:active"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["app:org:get:active"]()),
      ZApp.AppOrgGetActive.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const appOrgGetList = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["app:org:get:all"]],
  queryFn: async () => {
    const res = await authClient.organization.list();
    if (res.error) {
      throw new ApiError(
        res.error.message || "Failed to fetch organizations",
        400
      );
    }
    return ZApp.AppOrgGetList.shape.res.parse(res.data);
  },
} satisfies QueryConfig;

const appOrgSetActive = {
  type: "mutation",
  mutationFn: async (body: Infer["AppOrgSetActive"]["body"]) => {
    const res = await authClient.organization.setActive({
      organizationId: body.id,
    });

    if (res.error) {
      throw new ApiError(
        res.error.message || "Failed to set active organization",
        400
      );
    }
    return "Organization set as active successfully";
  },
} satisfies MutationConfig;

const appOrgUpdateActive = {
  type: "mutation",
  mutationFn: async (body: Infer["AppOrgUpdateActive"]["body"]) => {
    const res = await authClient.organization.update({
      data: {
        name: body.name,
        logo: body.logo,
      },
    });

    if (res.error) {
      throw new ApiError(
        res.error.message || "Failed to update organization",
        400
      );
    }
    return "Organization updated successfully";
  },
} satisfies MutationConfig;

const appOrgGetMembers = {
  type: "query",
  queryKey: (orgId: string) => [...QUERY_KEYS["app:org:get:members"](orgId)],
  queryFn: async (orgId: string) => {
    const data = await fetcher(
      () => axios.get(R["app:org:get:members"]({ orgId })),
      ZApp.AppOrgGetMembers.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const appOrgDeleteMember = {
  type: "mutation",
  mutationFn: async (
    vars: Pick<Infer["AppOrgDeleteMember"], "params" | "body">
  ) => {
    const data = await fetcher(
      () =>
        axios.delete(R["app:org:delete:member"]({ orgId: vars.params.orgId }), {
          data: vars.body,
        }),
      ZApp.AppOrgDeleteMember.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const appOrgUpdateMemberRole = {
  type: "mutation",
  mutationFn: async (
    vars: Pick<Infer["AppOrgUpdateMemberRole"], "params" | "body">
  ) => {
    const data = await fetcher(
      () =>
        axios.patch(
          R["app:org:patch:member-role"]({ orgId: vars.params.orgId }),
          vars.body
        ),
      ZApp.AppOrgUpdateMemberRole.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const appOrgInviteMember = {
  type: "mutation",
  mutationFn: async (
    vars: Pick<Infer["AppOrgInviteMember"], "params" | "body">
  ) => {
    const data = await fetcher(
      () =>
        axios.post(
          R["app:org:post:invite"]({ orgId: vars.params.orgId }),
          vars.body
        ),
      ZApp.AppOrgInviteMember.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

// ---------------------------------------------------------------------------
// MEDIA ENDPOINTS
// ---------------------------------------------------------------------------

const appMediaPostOne = {
  type: "mutation",
  mutationFn: async (body: Infer["AppMediaPostOne"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["app:media:post:one"](), body),
      ZApp.AppMediaPostOne.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

export default {
  "app:user:get:me": appUserGetMe,
  "app:user:delete:me": appUserDeleteMe,
  "app:user:patch:onboarding": appUserPatchOnboarding,
  "app:user:register": appUserRegister,
  "app:user:login": appUserLogin,
  "app:user:logout": appUserLogout,
  "app:user:check-otp": appUserCheckOtp,
  "app:user:verify-email-otp": appUserVerifyEmailOtp,
  "app:user:send-otp": appUserSendOtp,
  "app:user:reset-password": appUserResetPassword,
  "app:user:update-account": appUserUpdateAccount,
  "app:user:update-password": appUserUpdatePassword,
  "app:org:get:subscription": appOrgGetSubscription,
  "app:org:post:create": appOrgCreate,
  "app:org:get:active": appOrgGetActive,
  "app:org:get:all": appOrgGetList,
  "app:org:patch:active": appOrgSetActive,
  "app:org:update-active": appOrgUpdateActive,
  "app:org:get:members": appOrgGetMembers,
  "app:org:delete:member": appOrgDeleteMember,
  "app:org:patch:member-role": appOrgUpdateMemberRole,
  "app:org:post:invite": appOrgInviteMember,
  "app:media:post:one": appMediaPostOne,
};
