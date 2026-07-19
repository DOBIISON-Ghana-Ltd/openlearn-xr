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

  "public:session:get:all":           () => '/api/sessions',
  "public:session:get:overview":      (id: string) => `/api/sessions/${id}/overview`,
  "public:session:post:create":       () => '/api/sessions',
  "public:module-version:get:all":    () => '/api/modules/versions',
  "public:module-completion:get:all": () => '/api/modules/completions',
} as const;


export default ROUTES;