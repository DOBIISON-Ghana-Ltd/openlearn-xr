import z from "zod";
import { AVATARS, ORG_LOGOS, avatarKeys, logoKeys } from "@/lib/constants/avatars";

// ==========================================
// UTILITIES
// ==========================================

export const ZMediaFile = z.file()
  .max(5_000_000) // 5MB
  .mime(["image/png", "image/jpeg", "image/jpg", "image/webp"])
  .nullable();

export const ZDate = z.preprocess((val) => {
  if (val instanceof Date) {
    return val.toISOString();
  }
  return val;
}, z.string());

export const ZStorageMetadata = z.object({
  key: z.string(),
  msc: z.string()
});

export const ZSessionConfig = z.object({
  allowLateAdmissions: z.boolean().default(true),
  maxAdmissions: z.number().int().positive().default(50),
  controlMode: z.enum(["tutor-led", "self-paced"]).default("self-paced"),
  allowHints: z.boolean().default(true)
}).catch({
  allowLateAdmissions: true,
  maxAdmissions: 50,
  controlMode: "self-paced",
  allowHints: true
});

export const ServerModeEnum = z.enum(["local", "remote", "session"]);
export type ServerMode = z.infer<typeof ServerModeEnum>;

export const ZBaseFilter = z.object({
  search: z.string().optional(),

  // Pagination (The "Null-Safe" Logic)
  limit: z.preprocess((val) => {
    if (val === 'null' || val === '') return null;
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number().int().positive().nullable().optional()),

  page: z.preprocess((val) => {
    if (val === '' || val === undefined) return 1;
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number().int().positive().optional()),
});

export const ZPaginationMetadata = z.object({
  isFirstPage: z.coerce.boolean(),
  isLastPage: z.coerce.boolean(),
  currentPage: z.coerce.number().int().positive(),
  previousPage: z.coerce.number().int().positive().nullable(),
  nextPage: z.coerce.number().int().positive().nullable(),
  pageCount: z.coerce.number().int().nonnegative(),
  totalCount: z.coerce.number().int().nonnegative(),
});

export const ZWithPagination = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.tuple([
    z.array(dataSchema),
    ZPaginationMetadata
  ]);

export const ZApiResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion('status', [
    z.object({
      status: z.literal('success'),
      data: dataSchema,
    }),
    z.object({
      status: z.literal('error'),
      message: z.string(),
      code: z.number().optional(),
    }),
  ]);

export const ZApi = <
  B extends z.ZodTypeAny = z.ZodUndefined,
  P extends z.ZodTypeAny = z.ZodUndefined,
  Q extends z.ZodTypeAny = z.ZodUndefined,
  R extends z.ZodTypeAny = z.ZodString
>(opts: {
  body?: B;
  params?: P;
  query?: Q;
  res?: R;
} = {}) =>
  z.object({
    body: opts.body ?? (z.undefined() as any as B),
    params: opts.params ?? (z.undefined() as any as P),
    query: opts.query ?? (z.undefined() as any as Q),
    res: opts.res ?? (z.string() as any as R),
  });

// ==========================================
// ENUMS
// ==========================================

/** User role — users can hold multiple roles (e.g. "user,admin") */
export const RoleEnum = z.enum(["user", "editor", "admin"]);

/** Pre-processes a comma-separated string or array into a validated role array */
export const ZRoleList = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return value;
}, z.array(RoleEnum).min(1));

export const InvitationStatusEnum = z.enum(["pending", "accepted", "rejected", "canceled"]);

export const MemberRoleEnum = z.enum(["owner", "member"]);

export const SubscriptionTierEnum = z.enum(["FREE", "PRO", "DEPARTMENT", "ENTERPRISE", "UNLIMITED"]);

export const SubscriptionStatusEnum = z.enum(["ACTIVE", "PAST_DUE", "CANCELED", "TRIALING"]);

export const MediaStatusEnum = z.enum(["active", "deleted", "uploading", "processing", "ready", "failed"]);

export const ModuleDifficultyEnum = z.enum(["EAZY", "MEDIUM", "HARD"]);

export const ModuleVersionStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const ModuleProgressPlayModeEnum = z.enum(["free", "controlled"]);

export const GamificationLogActionEnum = z.enum(["XP_EARNED", "XP_DEDUCTED", "STREAK_INCREMENT", "STREAK_RESET", "BADGE_AWARDED"]);

export const LiveSessionStatusEnum = z.enum(["STAGING", "ACTIVE", "COMPLETED", "CANCELLED"]);

export const EmailLogStatusEnum = z.enum(["QUEUED", "SENT", "FAILED", "BOUNCED"]);

export const ZNote = z.object({
  overview: z.object({
    objectives: z.string().array()
  }),
  engage: z.object({
    curiosityQuestion: z.string(),
    preAssessment: z.object({
      question: z.string(),
      options: z.string().array(),
      answer: z.number()
    }).array(),
  }),
  explanation: z.object({
    items: z.object({
      name: z.string(),
      image: z.string(),
      description: z.string()
    }).array(),
    keyTakeaways: z.object({
      phrase: z.string(),
      description: z.string()
    }).array()
  })
})

// ==========================================
// BETTER AUTH CORE
// ==========================================

export const ZUser = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: ZRoleList.default(["user"]),
  email: z.string().email("Invalid email address"),
  emailVerified: z.boolean().default(false),
  image: z.enum(avatarKeys).default("avatar-01"),
  banned: z.boolean().nullable().default(false),
  banReason: z.string().nullable(),
  banExpires: ZDate.nullable(),
  onboarded: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).nullable(),
  // Gamification aggregate
  xp: z.number().int().default(0),
  currentStreak: z.number().int().default(0),
  longestStreak: z.number().int().default(0),
  badges: z.array(z.string()).default([]),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZSession = z.object({
  id: z.string(),
  expiresAt: ZDate,
  token: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
  impersonatedBy: z.string().nullable(),
  activeOrganizationId: z.string().nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

/** Password validator for forms — always required, 8–64 chars */
export const ZPassword = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters");

export const ZAccount = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  idToken: z.string().nullable(),
  accessTokenExpiresAt: ZDate.nullable(),
  refreshTokenExpiresAt: ZDate.nullable(),
  scope: z.string().nullable(),
  /** Stored password — nullable because OAuth accounts have no password */
  password: ZPassword.nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZVerification = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: ZDate,
  createdAt: ZDate,
  updatedAt: ZDate,
});

// ==========================================
// ORGANIZATION & MEMBERSHIP
// ==========================================

export const ZInvitation = z.object({
  id: z.string(),
  organizationId: z.string(),
  email: z.string().email(),
  role: z.string().nullable(),
  status: InvitationStatusEnum.default("pending"),
  expiresAt: ZDate,
  inviterId: z.string(),
  createdAt: ZDate,
});

export const ZOrganization = z.object({
  id: z.string(),
  name: z.string().min(1, "Organization name is required"),
  slug: z.string(),
  logo: z.enum(logoKeys).default("org-01"),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZMember = z.object({
  id: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  role: MemberRoleEnum,
  createdAt: ZDate,
  updatedAt: ZDate,
});

// ==========================================
// SAAS & LICENSING LAYER
// ==========================================

export const ZSubscription = z.object({
  id: z.string(),
  organizationId: z.string(),
  transactionId: z.string().nullable(),
  tier: SubscriptionTierEnum.default("FREE"),
  status: SubscriptionStatusEnum.default("ACTIVE"),
  seats: z.number().int().default(1),
  isUnlimited: z.boolean().default(false),
  paystackCustomerCode: z.string().nullable(),
  paystackSubCode: z.string().nullable(),
  currentPeriodEnd: ZDate.nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZTransaction = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string().nullable(),
  reference: z.string(),
  amount: z.number().int(),
  currency: z.string().default("GHS"),
  status: z.string().default("PENDING"),
  channel: z.string().nullable(),
  metadata: z.any().nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

// ==========================================
// EDITOR SUITE — MEDIA & COLLECTIONS
// ==========================================

export const ZMediaMetadata = z.object({
  sizeBytes: z.number().int().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});

export const ZMedia = z.object({
  id: z.string(),
  uploaderId: z.string(),
  folder: z.string(),
  status: MediaStatusEnum.default("active"),
  key: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  metadata: ZMediaMetadata.nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZCollection = z.object({
  id: z.string(),
  name: z.string().min(1, "Collection name is required"),
  slug: z.string(),
  description: z.string().nullable(),
  grade: z.string(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZCollectionMedia = z.object({
  id: z.string(),
  collectionId: z.string(),
  mediaId: z.string(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

// ==========================================
// EDITOR SUITE — AI CHAT HISTORY
// ==========================================

export const ZEditorChat = z.object({
  id: z.string(),
  moduleVersionId: z.string(),
  userId: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  createdAt: ZDate,
  updatedAt: ZDate,
});

// ==========================================
// MODULE LAYER
// ==========================================

export const ZModule = z.object({
  id: z.string(),
  collectionId: z.string(),
  title: z.string().min(1, "Title is required"),
  image: z.string().nullable(),
  slug: z.string(),
  duration: z.string().nullable(),
  difficulty: ModuleDifficultyEnum,
  description: z.string(),
  orderIndex: z.number().int(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZModuleVersion = z.object({
  id: z.string(),
  moduleId: z.string(),
  versionNumber: z.number().int().positive(),
  branchedFromId: z.string().nullable(),
  status: ModuleVersionStatusEnum.default("DRAFT"),
  interactiveConfig: z.record(z.string(), z.any()),
  notes: ZNote.nullable(),
  changeNote: z.string().nullable(),
  createdById: z.string(),
  publishedAt: ZDate.nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZModuleCheckpoint = z.object({
  id: z.string(),
  moduleVersionId: z.string(),
  orderIndex: z.number().int(),
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()),
  correctAnswer: z.number().int(),
  points: z.number().int().default(10),
  explanation: z.string(),
  hint: z.string(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

// ==========================================
// SIMULATION SUITE — GAMIFICATION & PROGRESS
// ==========================================

export const ZCollectionProgress = z.object({
  id: z.string(),
  userId: z.string(),
  collectionId: z.string(),
  activeIndex: z.number().int().default(0),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZModuleCompletion = z.object({
  id: z.string(),
  userId: z.string(),
  moduleId: z.string(),
  lastPlayedVersionId: z.string().nullable(),
  highScore: z.number().int().default(0),
  lastScore: z.number().int().default(0),
  totalPlays: z.number().int().default(0),
  lastPlayedAt: ZDate.nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZPlayAttempt = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  sessionId: z.string().nullable(),
  moduleVersionId: z.string(),
  playMode: z.enum(["session", "library", "free"]),
  currentTab: z.number().int().default(0),
  progress: z.number().int().default(0),
  currentCheckpointIndex: z.number().int().default(0),
  accumulatedPoints: z.number().int().default(0),
  sessionPlayerId: z.string().nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZGamificationLog = z.object({
  id: z.string(),
  userId: z.string(),
  action: GamificationLogActionEnum,
  delta: z.number().int().default(0),
  meta: z.record(z.string(), z.any()).nullable(),
  createdAt: ZDate,
});

// ==========================================
// SESSION SUITE — LIVE SESSIONS
// ==========================================

export const ZLiveSession = z.object({
  id: z.string(),
  hostId: z.string(),
  organizationId: z.string().nullable(),
  moduleVersionId: z.string(),
  joinCode: z.string(),
  name: z.string(),
  status: LiveSessionStatusEnum.default("STAGING"),
  config: ZSessionConfig,
  currentTab: z.number().int().default(0),
  startedAt: ZDate.nullable(),
  endedAt: ZDate.nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZSessionCheckpoint = z.object({
  id: z.string(),
  sessionId: z.string(),
  checkpointId: z.string(),
  isEnabled: z.boolean().default(true),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZSessionPlayer = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  avatar: z.enum(avatarKeys).default("avatar-01"),
  score: z.number().int().default(0),
  completionRate: z.number().min(0).max(1).default(0.0),
  joinedAt: ZDate,
  completedAt: ZDate.nullable(),
});

export const ZSessionAnalytic = z.object({
  id: z.string(),
  sessionId: z.string(),
  playerId: z.string(),
  event: z.string(),
  payload: z.record(z.string(), z.any()).nullable(),
  recordedAt: ZDate,
});

// ==========================================
// ADMIN SUITE — GLOBAL SETTINGS & LOGS
// ==========================================

export const ZAppSetting = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
  description: z.string().nullable(),
  updatedById: z.string().nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

export const ZEmailLog = z.object({
  id: z.string(),
  to: z.email(),
  subject: z.string(),
  template: z.string().nullable(),
  status: EmailLogStatusEnum.default("QUEUED"),
  errorMsg: z.string().nullable(),
  sentAt: ZDate.nullable(),
  createdAt: ZDate,
  updatedAt: ZDate,
});

// ==========================================
// DEFAULT EXPORT
// ==========================================

const baseSchema = {
  ServerModeEnum,
  // Utilities
  ZMediaFile,
  ZDate,
  ZBaseFilter,
  ZStorageMetadata,
  ZPaginationMetadata,
  ZMediaMetadata,
  // Enums
  RoleEnum,
  ZRoleList,
  InvitationStatusEnum,
  MemberRoleEnum,
  SubscriptionTierEnum,
  SubscriptionStatusEnum,
  MediaStatusEnum,
  ModuleVersionStatusEnum,
  ModuleProgressPlayModeEnum,
  GamificationLogActionEnum,
  LiveSessionStatusEnum,
  EmailLogStatusEnum,
  // Better Auth Core
  ZUser,
  ZSession,
  ZAccount,
  ZPassword,
  ZVerification,
  // Organization & Membership
  ZInvitation,
  ZOrganization,
  ZMember,
  // SaaS & Licensing
  ZSubscription,
  // Editor Suite
  ZMedia,
  ZCollection,
  ZCollectionMedia,
  ZEditorChat,
  // Module Layer
  ZModule,
  ZModuleVersion,
  ZModuleCheckpoint,
  // Gamification & Progress
  ZCollectionProgress,
  ZModuleCompletion,
  ZPlayAttempt,
  ZGamificationLog,
  // Live Sessions
  ZLiveSession,
  ZSessionCheckpoint,
  ZSessionPlayer,
  ZSessionAnalytic,
  // Admin Suite
  ZAppSetting,
  ZEmailLog,
};

export default baseSchema;