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
  "sim:module-completion:get:all": () => `/api/sim/modules/completions`,
  "sim:collection:get:all": () => `/api/sim/collections`,
  "sim:collection:get:modules": ({ collectionId }: { collectionId: string }) => `/api/sim/collections/${collectionId}/modules`,
  "sim:session:get:stats": ({ id }: { id: string }) => `/api/sim/sessions/${id}/stats`,
  "sim:session:get:players": ({ id }: { id: string }) => `/api/sim/sessions/${id}/players`,
  "sim:module:get:stats": ({ id }: { id: string }) => `/api/sim/modules/${id}/stats`,
  "sim:session:post:join": ({ id }: { id: string }) => `/api/sim/sessions/${id}/join`,
  "sim:session:post:leave": ({ id }: { id: string }) => `/api/sim/sessions/${id}/leave`,

  // SES SUITE
  "ses:session:get:all": () => `/api/ses/sessions`,
  "ses:session:get:overview": (id: string) => `/api/ses/sessions/${id}/overview`,
  "ses:session:get:notes": (id: string) => `/api/ses/sessions/${id}/notes`,
  "ses:session:get:players": (id: string) => `/api/ses/sessions/${id}/players`,
  "ses:session:get:player-summary": (id: string) => `/api/ses/sessions/${id}/player-summary`,
  "ses:session:post:create": () => `/api/ses/sessions`,
  "ses:session:post:start": (id: string) => `/api/ses/sessions/${id}/start`,
  "ses:module-version:get:options": () => `/api/ses/modules-versions/options`,

  // EDITOR SUITE
  "editor:collection:get:all": () => `/api/editor/collections`,
  "editor:collection:get:documents": ({ collectionId }: { collectionId: string }) => `/api/editor/collections/${collectionId}/documents`,
  "editor:collection:patch:details": ({ id }: { id: string }) => `/api/editor/collections/${id}`,
  "editor:collection:post:create": () => `/api/editor/collections`,
  "editor:module:get:all": () => `/api/editor/modules`,
  "editor:module:post:create": () => `/api/editor/modules`,

  // ADMIN SUITE
  "admin:user:get:all": () => `/api/admin/users`,
  "admin:subscription:get:all": () => `/api/admin/subscriptions`,
  "admin:email-log:get:all": () => `/api/admin/email`,
} as const;

export default ROUTES;