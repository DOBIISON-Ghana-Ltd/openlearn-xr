const ROUTES = {
  // APP SUITE
  "app:user:get:me": () => `/api/app/users/me`,
  "app:user:delete:me": () => `/api/app/users/me`,
  "app:user:patch:onboarding": () => `/api/app/users/onboarding`,
  "app:media:post:one": () => `/api/app/media`,
  "app:org:get:subscription": ({ orgId }: { orgId: string }) => `/api/app/org/${orgId}/subscription`,
  "app:org:get:active": () => `/api/app/org/active`,
  "app:org:get:members": ({ orgId }: { orgId: string }) => `/api/app/org/${orgId}/members`,
  "app:org:delete:member": ({ orgId }: { orgId: string }) => `/api/app/org/${orgId}/members`,
  "app:org:patch:member-role": ({ orgId }: { orgId: string }) => `/api/app/org/${orgId}/members/role`,
  "app:org:post:invite": ({ orgId }: { orgId: string }) => `/api/app/org/${orgId}/members/invite`,

  // SIM SUITE
  "sim:module:get:all": () => `/api/sim/modules`,
  "sim:module-version:get:options": () => `/api/sim/modules/versions`,
  "sim:module-completion:get:all": () => `/api/sim/modules/completions`,

  // SES SUITE
  "ses:session:get:all": () => `/api/ses/sessions`,
  "ses:session:get:overview": (id: string) => `/api/ses/sessions/${id}/overview`,
  "ses:session:post:create": () => `/api/ses/sessions`,

  // EDITOR SUITE
  "editor:collection:get:all": () => `/api/editor/collections`,
  "editor:collection:get:documents": ({ collectionId }: { collectionId: string }) => `/api/editor/collections/${collectionId}/documents`,
  "editor:collection:patch:details": ({ id }: { id: string }) => `/api/editor/collections/${id}`,
  "editor:collection:post:create": () => `/api/editor/collections`,
  "editor:module:get:all": () => `/api/editor/modules`,
  "editor:module:post:create": () => `/api/editor/modules`,
  "editor:module-version:get:options": () => `/api/sim/modules/versions`,

  // ADMIN SUITE
  "admin:user:get:all": () => `/api/admin/users`,
  "admin:subscription:get:all": () => `/api/admin/subscriptions`,
  "admin:email-log:get:all": () => `/api/admin/email`,
} as const;

export default ROUTES;