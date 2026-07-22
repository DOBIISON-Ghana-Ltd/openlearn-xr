import { z } from "zod";
import { ZAccount, ZApi, ZEmailLog, ZMediaFile, ZPassword, ZRoleList, ZSession, ZUser } from "@/data/schema.base";
import { ZOnboardingMetadata } from "@/store/onboarding/schema";

const ZOtpType = z.enum(["email-verification", "sign-in", "forget-password"]);
const ZOtp = z.string().length(6, "OTP must be 6 digits");

const PublicUserGetMe = ZApi({
  res: ZUser.pick({
    id: true,
    name: true,
    role: true,
    email: true,
    image: true,
    onboarded: true,
    createdAt: true
  }).extend({
    ...ZSession.pick({
      activeOrganizationId: true
    }).shape,
    subscriptionTier: z.string(),
    isUnlimited: z.boolean()
  })
});

const PublicUserLogin = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    password: ZPassword,
    redirect: z.string().optional()
  })
});

const PublicUserRegister = ZApi({
  body: z.object({
    name: ZUser.shape.name,
    email: ZUser.shape.email,
    password: ZPassword,
    confirmPassword: ZPassword,
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
    newPassword: ZPassword,
    confirmPassword: ZPassword
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
});

const PublicUserDeleteMe = ZApi({});

const PublicUserPatchOnboarding = ZApi({
  body: ZOnboardingMetadata
});

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
  )
});

const AdminUserSetRole = ZApi({
  body: z.object({
    userId: ZUser.shape.id,
    role: ZRoleList,
  })
});

const PublicUserUpdateAccount = ZApi({
  body: ZUser.pick({
    name: true,
    email: true,
  }).extend({
    image: ZUser.shape.image.unwrap(),
  })
});

const PublicUserUpdatePassword = ZApi({
  body: z.object({
    oldPassword: ZAccount.shape.password.unwrap(),
    newPassword: ZAccount.shape.password.unwrap(),
    confirmNewPassword: ZAccount.shape.password.unwrap(),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
  })
});

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
  )
});

const schema = {
  PublicUserGetMe,
  PublicUserLogin,
  PublicUserRegister,
  PublicUserCheckOtp,
  PublicUserVerifyEmail,
  PublicUserSendOtp,
  PublicUserResetPassword,
  PublicUserDeleteMe,
  PublicUserPatchOnboarding,
  AdminUserGetAll,
  AdminUserSetRole,
  PublicUserUpdateAccount,
  PublicUserUpdatePassword,
  AdminEmailLogGetAll,
};

export default schema;