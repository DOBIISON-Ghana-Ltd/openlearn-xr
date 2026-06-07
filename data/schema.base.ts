import z from "zod";

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

  // 2. Pagination (The "Null-Safe" Logic)
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

export const RoleEnum = z.enum(["user", "editor", "admin"]);

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

export const ZUser = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: ZRoleList.default(["user"]),
  avatarId: z.string().nullable(),
  email: z.string().email("Invalid email address"),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable(),
  banned: z.boolean().nullable().default(false),
  banReason: z.string().nullable(),
  banExpires: z.string().nullable(),
  onboarded: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).nullable(),
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
  createdAt: z.string(),
  updatedAt: z.string()
});

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
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters"),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const ZVerification = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ZMedia = z.object({
  id: z.string(),
  uploaderId: z.string(),
  folder: z.enum(["user.avatar"]),
  status: z.enum(["active", "deleted"]).default("active"),
  key: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const baseSchema = {
  ZMediaFile,
  ZBaseFilter,
  ZUser,
  ZMedia,
  ZStorageMetadata,
  ZSession,
  ZAccount,
  ZVerification
};

export default baseSchema;