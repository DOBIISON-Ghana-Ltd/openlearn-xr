import { Infer } from "./types.base";

const ROUTES = {
  // USERS
  "public:user:get:me": () => `/api/users/me`,
  "public:user:delete:me": () => '/api/users/me',
  "public:user:patch:onboarding": () => '/api/users/onboarding',
  "admin:user:get:all": () => `/api/admin/users`,

  // MEDIA
  "public:media:post:one": () => `/api/media`,

  // ORGANIZATIONS
  "public:org:get:subscription": ({ orgId }: { orgId: string }) => `/api/org/${orgId}/subscription`,
  "public:org:get:active": () => '/api/org/active',
} as const;

export default ROUTES;