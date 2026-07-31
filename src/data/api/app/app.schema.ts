import { z } from "zod";
import {
  ZAccount,
  ZApi,
  ZMedia,
  ZMember,
  ZOrganization,
  ZPassword,
  ZSession,
  ZSubscription,
  ZUser,
} from "@/data/schema.base";

const ZOtpType = z.enum(["email-verification", "sign-in", "forget-password"]);
const ZOtp = z.string().length(6, "OTP must be 6 digits");

// ---------------------------------------------------------------------------
// USER SCHEMAS
// ---------------------------------------------------------------------------

const AppUserGetMe = ZApi({
  res: ZUser.pick({
    id: true,
    name: true,
    role: true,
    email: true,
    image: true,
    onboarded: true,
    createdAt: true,
  }).extend({
    ...ZSession.pick({
      activeOrganizationId: true,
    }).shape,
    subscriptionTier: z.string(),
    isUnlimited: z.boolean(),
  }),
});

const AppUserLogin = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    password: ZPassword,
    redirect: z.string().optional(),
  }),
});

const AppUserRegister = ZApi({
  body: z
    .object({
      name: ZUser.shape.name,
      email: ZUser.shape.email,
      password: ZPassword,
      confirmPassword: ZPassword,
      agreeToTerms: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })
    .refine((data) => data.agreeToTerms, {
      message: "You must agree to the terms and conditions",
      path: ["agreeToTerms"],
    }),
});

const AppUserCheckOtp = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    type: ZOtpType,
    otp: ZOtp,
  }),
});

const AppUserVerifyEmailOtp = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    otp: ZOtp,
  }),
});

const AppUserSendOtp = ZApi({
  body: z.object({
    email: ZUser.shape.email,
    type: ZOtpType,
  }),
});

const AppUserResetPassword = ZApi({
  body: z
    .object({
      email: ZUser.shape.email,
      otp: ZOtp,
      newPassword: ZPassword,
      confirmPassword: ZPassword,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
});

const AppUserDeleteMe = ZApi({});

const AppUserUpdateAccount = ZApi({
  body: ZUser.pick({
    name: true,
    email: true,
  }).extend({
    image: ZUser.shape.image.unwrap(),
  }),
});

const AppUserUpdatePassword = ZApi({
  body: z
    .object({
      oldPassword: ZAccount.shape.password.unwrap(),
      newPassword: ZAccount.shape.password.unwrap(),
      confirmNewPassword: ZAccount.shape.password.unwrap(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    }),
});

// ---------------------------------------------------------------------------
// ORGANIZATION SCHEMAS
// ---------------------------------------------------------------------------

const AppOrgGetSubscription = ZApi({
  params: z.object({ orgId: z.string() }),
  res: ZSubscription.pick({
    id: true,
    status: true,
    seats: true,
    isUnlimited: true,
    currentPeriodEnd: true,
  }),
});

const AppOrgGetList = ZApi({
  res: ZOrganization.pick({
    id: true,
    name: true,
    logo: true,
  }).array(),
});

const AppOrgCreate = ZApi({
  body: ZOrganization.pick({ name: true }),
});

const AppOrgGetActive = ZApi({
  res: ZOrganization.pick({
    id: true,
    name: true,
    logo: true,
  }).extend({
    subscriptionTier: z.string(),
  }),
});

const AppOrgSetActive = ZApi({
  body: ZOrganization.pick({
    id: true,
  }),
});

const AppOrgUpdateActive = ZApi({
  body: ZOrganization.pick({
    name: true,
  }).extend({
    logo: ZOrganization.shape.logo.unwrap(),
  }),
});

const AppOrgGetMembers = ZApi({
  params: z.object({ orgId: z.string() }),
  res: z.array(
    ZMember.pick({ id: true, role: true, createdAt: true }).extend({
      user: ZUser.pick({ id: true, name: true, email: true, image: true }),
    })
  ),
});

const AppOrgDeleteMember = ZApi({
  params: z.object({ orgId: z.string() }),
  body: ZMember.pick({ id: true }),
});

const AppOrgUpdateMemberRole = ZApi({
  params: z.object({ orgId: z.string() }),
  body: ZMember.pick({ id: true, role: true }),
});

const AppOrgInviteMember = ZApi({
  params: z.object({ orgId: z.string() }),
  body: z.object({
    email: z.email(),
    role: ZMember.shape.role.default("member"),
  }),
});

// ---------------------------------------------------------------------------
// MEDIA SCHEMAS
// ---------------------------------------------------------------------------

const AppMediaPostOne = ZApi({
  body: ZMedia.pick({
    folder: true,
    key: true,
    fileName: true,
    mimeType: true,
  }).extend({
    width: z.number().int().optional(),
    height: z.number().int().optional(),
  }),
  res: ZMedia.pick({
    id: true,
  }),
});

const schema = {
  AppUserGetMe,
  AppUserLogin,
  AppUserRegister,
  AppUserCheckOtp,
  AppUserVerifyEmailOtp,
  AppUserSendOtp,
  AppUserResetPassword,
  AppUserDeleteMe,
  AppUserUpdateAccount,
  AppUserUpdatePassword,
  AppOrgGetSubscription,
  AppOrgGetList,
  AppOrgCreate,
  AppOrgGetActive,
  AppOrgSetActive,
  AppOrgUpdateActive,
  AppOrgGetMembers,
  AppOrgDeleteMember,
  AppOrgUpdateMemberRole,
  AppOrgInviteMember,
  AppMediaPostOne,
};

export default schema;
