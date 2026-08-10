export const QUERY_KEYS = {
  // APP SUITE
  "app:user:get:me": ["app", "user", "me"] as const,
  "app:org:get:active": ["app", "org", "active"] as const,
  "app:org:get:all": ["app", "org", "all"] as const,
  "app:org:get:members": (orgId: string) => ["app", "org", orgId, "members"] as const,
  "app:org:get:subscription": (orgId: string) => ["app", "org", orgId, "subscription"] as const,

  // SIM SUITE
  "sim:module:get:all": (query?: Record<string, any>) => ["sim", "module", "all", query] as const,
  "sim:module:get:one": (id: string, query?: Record<string, any>) => ["sim", "module", id, "one", query] as const,
  "sim:checkpoint:get:one": (playId: string, query?: Record<string, any>) => ["sim", "checkpoint", playId, query] as const,
  "sim:general:get:score": (playId: string, query?: Record<string, any>) => ["sim", "general", playId, "score", query] as const,
  "sim:module-completion:get:all": ["sim", "module-completion", "all"] as const,
  "sim:collection:get:all": ["sim", "collection", "all"] as const,
  "sim:collection:get:modules": (collectionId: string) => ["sim", "collection", collectionId, "modules"] as const,
  "sim:session:get:stats": (id: string) => ["sim", "session", id, "stats"] as const,
  "sim:session:get:players": (id: string) => ["sim", "session", id, "players"] as const,
  "sim:module:get:stats": (id: string) => ["sim", "module", id, "stats"] as const,

  // SES SUITE
  "ses:session:get:all": ["ses", "session", "all"] as const,
  "ses:session:get:overview": (id: string) => ["ses", "session", id, "overview"] as const,
  "ses:session:get:notes": (id: string) => ["ses", "session", id, "notes"] as const,
  "ses:session:get:players": (id: string) => ["ses", "session", id, "players"] as const,
  "ses:session:get:player-summary": (id: string) => ["ses", "session", id, "player-summary"] as const,
  "ses:module-version:get:options": ["ses", "module-version", "options"] as const,

  // EDITOR SUITE
  "editor:collection:get:all": ["editor", "collection", "all"] as const,
  "editor:collection:get:documents": (collectionId: string) => ["editor", "collection", collectionId, "documents"] as const,
  "editor:module:get:all": ["editor", "module", "all"] as const,

  // ADMIN SUITE
  "admin:user:get:all": ["admin", "user", "all"] as const,
  "admin:subscription:get:all": ["admin", "subscription", "all"] as const,
  "admin:email-log:get:all": ["admin", "email-log", "all"] as const,
} as const;