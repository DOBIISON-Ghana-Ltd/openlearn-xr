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
  "public:org:get:members": ({ orgId }: { orgId: string }) => `/api/org/${orgId}/members`,
  "public:org:delete:member": ({ orgId }: { orgId: string }) => `/api/org/${orgId}/members`,
  "public:org:patch:member-role": ({ orgId }: { orgId: string }) => `/api/org/${orgId}/members/role`,
  "public:org:post:invite": ({ orgId }: { orgId: string }) => `/api/org/${orgId}/members/invite`,
} as const;

export default ROUTES;