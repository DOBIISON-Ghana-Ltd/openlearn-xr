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
  "public:collection:get:all":        () => '/api/editor/collections',
  "admin:collection:get:documents":   ({ collectionId }: { collectionId: string }) => `/api/editor/collections/${collectionId}/documents`,
  "admin:collection:patch:details":   ({ id }: { id: string }) => `/api/editor/collections/${id}`,
  "public:collection:post:create":     () => '/api/editor/collections',
  "public:module:get:all":            () => '/api/editor/modules',
  "public:module:post:create":        () => '/api/editor/modules',
  "admin:subscription:get:all":       () => '/api/admin/subscriptions',
  "admin:email-log:get:all":          () => '/api/admin/email',
} as const;


export default ROUTES;