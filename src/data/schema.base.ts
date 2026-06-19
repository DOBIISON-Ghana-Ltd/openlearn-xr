import z from "zod";

// ==========================================
// UTILITIES
// ==========================================

export const ZMediaFile = z.file()
  .max(5_000_000) // 5MB
  .mime(["image/png", "image/jpeg", "image/jpg", "image/webp"])
  .nullable();

export const ZStorageMetadata = z.object({
  key: z.string(),
  msc: z.string()
});

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

export const InvitationStatusEnum = z.enum([
  "pending",
  "accepted",
  "rejected",
  "canceled",
]);

export const MemberRoleEnum = z.enum([
  "owner",
  "admin",
  "editor",
  "teacher",
  "member",
]);

export const SubscriptionTierEnum = z.enum([
  "FREE",
  "PRO",
  "DEPARTMENT",
  "ENTERPRISE",
  "UNLIMITED",
]);

export const SubscriptionStatusEnum = z.enum([
  "ACTIVE",
  "PAST_DUE",
  "CANCELED",
  "TRIALING",
]);

export const MediaStatusEnum = z.enum([
  "active",
  "deleted",
  "uploading",
  "processing",
  "ready",
  "failed",
]);

export const ModuleVersionStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const ModuleProgressPlayModeEnum = z.enum(["free", "controlled"]);

export const GamificationLogActionEnum = z.enum([
  "XP_EARNED",
  "XP_DEDUCTED",
  "STREAK_INCREMENT",
  "STREAK_RESET",
  "BADGE_AWARDED",
]);

export const LiveSessionStatusEnum = z.enum([
  "STAGING",
  "WAITING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);

export const EmailLogStatusEnum = z.enum([
  "QUEUED",
  "SENT",
  "FAILED",
  "BOUNCED",
]);

// ==========================================
// BETTER AUTH CORE
// ==========================================

export const ZUser = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: ZRoleList.default(["user"]),
  avatar: z.string().nullable(),
  email: z.string().email("Invalid email address"),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable(),
  banned: z.boolean().nullable().default(false),
  banReason: z.string().nullable(),
  banExpires: z.string().nullable(),
  onboarded: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).nullable(),
  // Gamification aggregate
  xp: z.number().int().default(0),
  currentStreak: z.number().int().default(0),
  longestStreak: z.number().int().default(0),
  badges: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZSession = z.object({
  id: z.string(),
  expiresAt: z.string(),
  token: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
  impersonatedBy: z.string().nullable(),
  activeOrganizationId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  accessTokenExpiresAt: z.string().nullable(),
  refreshTokenExpiresAt: z.string().nullable(),
  scope: z.string().nullable(),
  /** Stored password — nullable because OAuth accounts have no password */
  password: ZPassword.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZVerification = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  expiresAt: z.string(),
  inviterId: z.string(),
  createdAt: z.string(),
});

export const ZOrganization = z.object({
  id: z.string(),
  name: z.string().min(1, "Organization name is required"),
  slug: z.string(),
  logo: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZMember = z.object({
  id: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  role: MemberRoleEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ==========================================
// SAAS & LICENSING LAYER
// ==========================================

export const ZSubscription = z.object({
  id: z.string(),
  organizationId: z.string(),
  tier: SubscriptionTierEnum.default("FREE"),
  status: SubscriptionStatusEnum.default("ACTIVE"),
  seats: z.number().int().default(1),
  isUnlimited: z.boolean().default(false),
  stripeCustomerId: z.string().nullable(),
  stripeSubId: z.string().nullable(),
  currentPeriodEnd: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  collectionId: z.string().nullable(),
  folder: z.string(),
  status: MediaStatusEnum.default("active"),
  key: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  metadata: ZMediaMetadata.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZCollection = z.object({
  id: z.string(),
  name: z.string().min(1, "Collection name is required"),
  slug: z.string(),
  description: z.string().nullable(),
  coverMediaId: z.string().nullable(),
  parsedIndex: z.record(z.string(), z.any()).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ==========================================
// MODULE LAYER
// ==========================================

export const ZModule = z.object({
  id: z.string(),
  collectionId: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string(),
  description: z.string(),
  thumbnail: z.string().nullable(),
  orderIndex: z.number().int(),
  publishedVersionId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZModuleVersion = z.object({
  id: z.string(),
  moduleId: z.string(),
  versionNumber: z.number().int().positive(),
  branchedFromId: z.string().nullable(),
  status: ModuleVersionStatusEnum.default("DRAFT"),
  simulationData: z.record(z.string(), z.any()),
  changeNote: z.string().nullable(),
  createdById: z.string(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZModuleCheckpoint = z.object({
  id: z.string(),
  moduleVersionId: z.string(),
  orderIndex: z.number().int(),
  question: z.string().min(1, "Question is required"),
  options: z.array(
    z.object({
      label: z.string(),
      text: z.string(),
      isCorrect: z.boolean(),
    })
  ),
  points: z.number().int().default(10),
  triggerAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ==========================================
// SIMULATION SUITE — GAMIFICATION & PROGRESS
// ==========================================

export const ZModuleProgress = z.object({
  id: z.string(),
  userId: z.string(),
  moduleId: z.string(),
  lastPlayedVersionId: z.string().nullable(),
  isUnlocked: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
  highScore: z.number().int().default(0),
  totalPlays: z.number().int().default(0),
  lastPlayedAt: z.string().nullable(),
  playMode: ModuleProgressPlayModeEnum.default("free"),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZGamificationLog = z.object({
  id: z.string(),
  userId: z.string(),
  action: GamificationLogActionEnum,
  delta: z.number().int().default(0),
  meta: z.record(z.string(), z.any()).nullable(),
  createdAt: z.string(),
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
  name: z.string().nullable(),
  status: LiveSessionStatusEnum.default("STAGING"),
  config: z.record(z.string(), z.any()).nullable(),
  startedAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZSessionCheckpoint = z.object({
  id: z.string(),
  sessionId: z.string(),
  checkpointId: z.string(),
  isEnabled: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZSessionPlayer = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string().nullable(),
  anonymousName: z.string().nullable(),
  score: z.number().int().default(0),
  completionRate: z.number().min(0).max(1).default(0.0),
  joinedAt: z.string(),
  completedAt: z.string().nullable(),
});

export const ZSessionAnalytic = z.object({
  id: z.string(),
  sessionId: z.string(),
  playerId: z.string(),
  event: z.string(),
  payload: z.record(z.string(), z.any()).nullable(),
  recordedAt: z.string(),
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
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZEmailLog = z.object({
  id: z.string(),
  to: z.string().email(),
  subject: z.string(),
  template: z.string().nullable(),
  status: EmailLogStatusEnum.default("QUEUED"),
  errorMsg: z.string().nullable(),
  sentAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ==========================================
// DEFAULT EXPORT
// ==========================================

const baseSchema = {
  // Utilities
  ZMediaFile,
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
  ZEditorChat,
  // Module Layer
  ZModule,
  ZModuleVersion,
  ZModuleCheckpoint,
  // Gamification & Progress
  ZModuleProgress,
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