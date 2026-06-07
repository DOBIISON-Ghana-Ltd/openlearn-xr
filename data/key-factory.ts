
export const QUERY_KEYS = {
  // USERS
  "public:users": ["public", "users"] as const,
  "admin:users": ["admin", "users"] as const,
  "public:users:get:me": ["public", "users", "me"] as const,
  "admin:users:get:all": ["admin", "users"] as const

  // MEDIA
} as const