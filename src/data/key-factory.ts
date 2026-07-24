export const QUERY_KEYS = {
  // APP SUITE
  "app:user:get:me": ["app", "user", "me"] as const,
  "app:org:get:active": ["app", "org", "active"] as const,
  "app:org:get:all": ["app", "org", "all"] as const,
  "app:org:get:members": (orgId: string) => ["app", "org", orgId, "members"] as const,
  "app:org:get:subscription": (orgId: string) => ["app", "org", orgId, "subscription"] as const,

  // SIM SUITE
  "sim:module:get:all": (query?: Record<string, any>) => ["sim", "module", "all", query] as const,
  "sim:module-version:get:options": ["sim", "module-version", "options"] as const,
  "sim:module-completion:get:all": ["sim", "module-completion", "all"] as const,
  "sim:collection:get:all": ["sim", "collection", "all"] as const,
  "sim:collection:get:modules": (collectionId: string) => ["sim", "collection", collectionId, "modules"] as const,

  // SES SUITE
  "ses:session:get:all": ["ses", "session", "all"] as const,
  "ses:session:get:overview": (id: string) => ["ses", "session", id, "overview"] as const,

  // EDITOR SUITE
  "editor:collection:get:all": ["editor", "collection", "all"] as const,
  "editor:collection:get:documents": (collectionId: string) => ["editor", "collection", collectionId, "documents"] as const,
  "editor:module:get:all": ["editor", "module", "all"] as const,
  "editor:module-version:get:options": ["editor", "module-version", "options"] as const,

  // ADMIN SUITE
  "admin:user:get:all": ["admin", "user", "all"] as const,
  "admin:subscription:get:all": ["admin", "subscription", "all"] as const,
  "admin:email-log:get:all": ["admin", "email-log", "all"] as const,
} as const;