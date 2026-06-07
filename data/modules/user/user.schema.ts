import { z } from "zod";
import { ZAccount, ZApi, ZMediaFile, ZUser } from "@/data/schema.base";

const ZOtpType = z.enum(["email-verification", "sign-in", "forget-password"]);
const ZOtp = z.string().length(6, "OTP must be 6 digits");

const PublicUserGetMe = ZApi({
  res: ZUser.pick({
    id: true,
    email: true,
    name: true,
    image: true,
    avatarId: true,
    role: true,
    onboarded: true,
    createdAt: true
  })
});

const PublicUserPatchMe = ZApi({
  body: ZUser.pick({
    name: true,
    image: true,
    avatarId: true,
  }).extend({
    file: ZMediaFile,
    deleteMedia: z.string().optional()
  })
});

const PublicUserLogin = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    password: ZAccount.shape.password,
    redirect: z.string().optional()
  })
});

const PublicUserRegister = ZApi({
  body: z.object({
    name: ZUser.shape.name,
    email: ZUser.shape.email,
    password: ZAccount.shape.password,
    confirmPassword: ZAccount.shape.password,
    agreeToTerms: z.boolean()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }).refine((data) => data.agreeToTerms, {
    message: "You must agree to the terms and conditions",
    path: ["agreeToTerms"]
  })
});

const PublicUserCheckOtp = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    type: ZOtpType,
    otp: ZOtp
  })
});

const PublicUserVerifyEmail = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    otp: ZOtp
  })
});

const PublicUserSendOtp = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    type: ZOtpType
  })
});

const PublicUserResetPassword = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    otp: ZOtp,
    newPassword: ZAccount.shape.password,
    confirmPassword: ZAccount.shape.password
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
});

const PublicUserDeleteMe = ZApi({});

const AdminUserGetAll = ZApi({
  res: ZUser.pick({
    id: true,
  }).array()
});

const schema = {
  PublicUserGetMe,
  PublicUserPatchMe,
  PublicUserLogin,
  PublicUserRegister,
  PublicUserCheckOtp,
  PublicUserVerifyEmail,
  PublicUserSendOtp,
  PublicUserResetPassword,
  PublicUserDeleteMe,
  AdminUserGetAll
};

export default schema;