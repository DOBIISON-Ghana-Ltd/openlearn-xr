import fetcher, { ApiError } from '@/data/fetcher';
import { axios } from '@/data/axios';
import R from '@/data/route-factory';
import { Infer, MutationConfig, QueryConfig } from '@/data/types.base';
import ZUser from './user.schema';
import { authClient } from '@/adapters/auth/client';
import { getImageUrl, handleFileUpload } from '@/lib/utils/media-helper';
import { ROUTES } from '@/lib/constants/routes';
import { QUERY_KEYS } from '@/data/key-factory';

const publicGetMe = {
  type: 'query',
  queryKey: () => [...QUERY_KEYS["public:users:get:me"]],
  queryFn: async () => {
    const res = await fetcher(
      () => axios.get(R["public:user:get:me"]()),
      ZUser.PublicUserGetMe.shape.res
    );

    return res;
  }
} satisfies QueryConfig;

const publicPatchMe = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserPatchMe"]["body"]) => {
    const finalBody: Infer["PublicUserPatchMe"]["body"] = { ...body };
    if (body.file) {
      const { file } = body;
      const uploadRes = await handleFileUpload({
        file,
        folder: "user.avatar",
        msc: "user.avatar"
      });

      if (!uploadRes) {
        throw new ApiError("File upload failed");
      }

      finalBody.avatarId = uploadRes.id;
      finalBody.image = getImageUrl(uploadRes.key);
      finalBody.file = null;
    };

    const data = await fetcher(
      () => axios.patch(R["public:user:patch:me"](), finalBody),
      ZUser.PublicUserPatchMe.shape.res
    );
    return data;
  }
} satisfies MutationConfig;

const publicDeleteMe = {
  type: 'mutation',
  mutationFn: async () => {
    const data = await fetcher(
      () => axios.delete(R["public:user:delete:me"]()),
      ZUser.PublicUserDeleteMe.shape.res
    );
    return data;
  }
} satisfies MutationConfig;

const publicPatchOnboarding = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserPatchOnboarding"]["body"]) => {
    const data = await fetcher(
      () => axios.patch(R["public:user:patch:onboarding"](), body),
      ZUser.PublicUserPatchOnboarding.shape.res
    );
    return data;
  }
} satisfies MutationConfig;

const publicRegister = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserRegister"]["body"]) => {
    const { error } = await authClient.signUp.email({
      name: body.name,
      email: body.email,
      password: body.password
    });
    if (error) throw new Error(error.message);
    return "User registered successfully.";
  }
} satisfies MutationConfig;

const publicLogin = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserLogin"]["body"]) => {
    const { error } = await authClient.signIn.email({
      email: body.email,
      password: body.password,
      callbackURL: body.redirect || ROUTES.APP.DASHBOARD
    });
    if (error) throw new Error(error.message);

    return "User logged in successfully.";
  }
} satisfies MutationConfig;

const publicLogout = {
  type: 'mutation',
  mutationFn: async () => {
    const { error } = await authClient.signOut();
    if (error) throw new Error(error.message);

    return "User logged out successfully.";
  }
} satisfies MutationConfig;

const publicCheckOtp = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserCheckOtp"]["body"]) => {
    const { error } = await authClient.emailOtp.checkVerificationOtp({
      email: body.email,
      type: body.type,
      otp: body.otp
    });

    if (error) throw new ApiError(
      error.message ?? "OTP invalid",
      error.status ?? 500
    );

    return "OTP verified successfully.";
  }
} satisfies MutationConfig;

// Verify the 6-digit OTP for email-verification type (post-registration).
const publicVerifyEmail = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserVerifyEmail"]["body"]) => {

    const { error } = await authClient.emailOtp.verifyEmail({
      email: body.email,
      otp: body.otp
    });

    if (error) throw new ApiError(
      error.message ?? "Failed to verify OTP",
      error.status ?? 500
    );

    return "Email verified successfully.";
  }
} satisfies MutationConfig;

const publicSendOtp = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserSendOtp"]["body"]) => {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: body.email,
      type: body.type
    });

    if (error) throw new ApiError(
      error.message ?? "Failed to send OTP",
      error.status ?? 500
    );

    return "OTP sent successfully.";
  }
} satisfies MutationConfig;

// Reset the user's password. token is the OTP sent via forget-password flow.
const publicResetPassword = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicUserResetPassword"]["body"]) => {
    const { error } = await authClient.emailOtp.resetPassword({
      email: body.email,
      password: body.newPassword,
      otp: body.otp
    });

    if (error) throw new ApiError(
      error.message ?? "Password reset failed",
      error.status ?? 500
    );

    return "Password reset successfully.";
  }
} satisfies MutationConfig;

const adminGetAll = {
  type: 'query',
  queryKey: () => [...QUERY_KEYS["admin:users:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["admin:user:get:all"]()),
      ZUser.AdminUserGetAll.shape.res
    );

    return data;
  }
} satisfies QueryConfig;

export default {
  "public:user:get:me": publicGetMe,
  "public:user:patch:me": publicPatchMe,
  "public:user:delete:me": publicDeleteMe,
  "public:user:patch:onboarding": publicPatchOnboarding,
  "public:user:register": publicRegister,
  "public:user:login": publicLogin,
  "public:user:logout": publicLogout,
  "public:user:check-otp": publicCheckOtp,
  "public:user:verify-email-otp": publicVerifyEmail,
  "public:user:send-otp": publicSendOtp,
  "public:user:reset-password": publicResetPassword,
  "admin:user:get:all": adminGetAll,
};