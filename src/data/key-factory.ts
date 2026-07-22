
export const QUERY_KEYS = {
  // USERS
  "public:users": ["public", "users"] as const,
  "admin:users": ["admin", "users"] as const,
  "public:users:get:me": ["public", "users", "me"] as const,
  "admin:users:get:all": ["admin", "users"] as const,

  // MEDIA
  "public:media:post:one": ["public", "media"] as const,

  // ORG
  "public:org:get:active": ["public", "org", "active"] as const,
  "public:org:get:all": ["public", "org", "all"] as const,
  "public:org:get:members": (orgId: string) => ["public", "org", orgId, "members"] as const,
  "public:org:get:subscription": (orgId: string) => ["public", "org", orgId, "subscription"] as const,

  // SESSIONS & MODULES
  "public:session:get:all": ["public", "session", "all"] as const,
  "public:session:get:overview": (id: string) => ["public", "session", id, "overview"] as const,
  "public:module-version:get:all": ["public", "module-version", "all"] as const,
  "public:module-completion:get:all": ["public", "module-completion", "all"] as const,
  "public:collection:get:all": ["public", "collection", "all"] as const,
  "public:module:get:all": ["public", "module", "all"] as const,
  "admin:subscription:get:all": ["admin", "subscription", "all"] as const,
  "admin:email-log:get:all": ["admin", "email-log", "all"] as const,
} as const