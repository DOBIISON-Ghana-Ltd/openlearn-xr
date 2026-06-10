# Technical Design: OpenLearn V1

> Status: LIVING — aligned with codebase implementation patterns (updated 2026-06-07)
> Last updated: 2026-06-07

## Overview
OpenLearn V1 is a web-based educational platform delivering interactive 3D science labs. It is built as a Next.js application using React Three Fiber (R3F) for 3D lab simulations, Postgres for data persistence, and Better Auth for user management. The MVP focuses on predefined modules with a flexible data schema adaptable for future 2D fallbacks.

## Key Components
1. **Lab Renderer (UI/Domain):** An R3F-based canvas that interprets module definitions and renders 3D interactive environments.
2. **Session Engine (Domain/Service):** Manages the lifecycle of an untimed, Kahoot-style session, tracking participant checkpoints and retakes based on host config.
3. **Module Schema (Data):** Agnostic JSON structure representing a lab environment, checkpoints, and assets.
4. **Auth & Identity (Adapter):** Manages registered users (RBAC: user/editor/admin) vs. anonymous session participants.
5. **Proxy / Route Guard (Infra):** Custom cookie-cache routing middleware (`proxy.ts`) implementing route protection, onboarding checks, and role gates.
6. **Email Service (Adapter):** Strategy pattern supporting Resend and AWS SES adapters with template rendering.
7. **Upload Pipeline (Utility):** Better-upload and S3-based media uploads paired with database record tracking.

## API Design
- **REST/JSend Envelope:** All `/api/*` routes return a standardized `{ status, data, message }` format via `JSend` utility helpers.
- **Client Fetching:** React Query wrapped around a standardized Axios instance (`fetcher.ts`). Hooks are generated via a unified `useApi` hook factory.
- **Server Gating:** Endpoints are protected with a custom `secureApiRoute` Higher-Order Function (HOF) to extract and verify session context.
- **SSR Pre-hydration:** Server components prefetch queries using `prefetchApi` and embed them into React Query hydration boundaries.

## Data Flow
1. **Direct Play:** Registered user fetches `Module` -> initializes Lab Renderer -> completes checkpoints -> server records score.
2. **Session Play:** Host creates `Session` (sets config) -> Server generates join code -> Participants join -> Server tracks real-time progress via polling -> Host ends session -> Leaderboard generated.

## Implementation Details
- **3D vs 2D:** The module is represented by a JSON lab object containing properties (e.g., 3D model positions, IDs). In the future, this can include 2D vector properties and a type flag. The architecture flows from data -> Zustand state -> renderer.
- **Session State:** Short-polling via React Query (every 3-5s) is used for leaderboard updates to avoid WebSocket complexity initially.
- **Play Route Layout (`play/[type]/[id]`):** This fullscreen route has no app shell. It features the interactive 3D lab canvas in a video aspect ratio (e.g., 16:9) at the top of the screen. Underneath the canvas, checkpoint questions are displayed.

## Stack and Core Libraries
- **Framework:** Next.js 16.2.7 + React 19.2.4
- **Database:** Postgres via Prisma 7.8.0 (configured with PG driver adapter `@prisma/adapter-pg`)
- **Auth:** Better Auth 1.6.14 (Email/Password with OTP verification, Google OAuth, RBAC admin plugin, and cookie cache)
- **Validation:** Zod 4.4
- **Data fetching:** React Query 5.101 (via `@tanstack/react-query`)
- **State Management:** Zustand 5.0.14
- **URL Query Parameters:** nuqs 2.8.9
- **Forms:** React Hook Form 7.77 + @hookform/resolvers 5.4
- **UI Styling:** COSS component library built on Base UI 1.5 primitives + Tailwind v4 + CVA + tailwind-merge + tw-animate-css
- **Animations:** Motion 12.40
- **Tables:** `@tanstack/react-table` 8.21
- **Uploads:** `@better-upload/client` and `@better-upload/server` 3.0.19 (uploads to S3)
- **Email:** `@react-email/components` + Resend / `@aws-sdk/client-ses` (SES)
- **Analytics:** `posthog-js` 1.379 + Google Analytics (consent-gated)

## Project Structure and Separation of Concerns
- Next.js App Router with `app/` at repo root (same level as `public/`, not under `src/`).
- Feature-based folders with shared layers split by responsibility (UI, state, data, domain, infra).

### Folder Structure
```
app/
	(admin)/          # Admin Dashboard, analytics, module/user management
	(app)/            # Core app shell: Dashboard, modules, sessions, community, my-plays
	(auth)/           # /login, /register, /forgot-password, /reset-password, /verify-email, /onboarding, /verify
	(marketing)/      # Landing page, /legal/terms, /legal/privacy, /legal/cookies
	play/             # /play/[type]/[id] unified fullscreen route layout
	api/              # /api/auth/[...all], /api/users/me, /api/admin/users, /api/media, /api/upload
	globals.css       # Global Tailwind v4 styles
	layout.tsx        # Root layout with providers

components/
	ui/                 # Shared, unopinionated UI primitives (55 COSS component definitions)
	forms/              # Shared form controls + RHF bindings
	layout/             # marketing/ (header/footer navigation), admin/ and app/ shells
	auth/               # Auth button structures & reusable inputs (form-blocks/)

features/
	rich-text-editor/   # Rich text custom integrations
	table/              # Custom data table wrappers

adapters/
	auth/               # Better-auth configuration, client instance, permissions & RBAC rules
	email/              # Resend and SES adapters with templating
	analytics/          # Consent-aware PostHog and Google Analytics tracking
	db/                 # Prisma client singleton with driver adapters

data/
	modules/
		user/
			user.api.ts
			user.schema.ts
		media/
			media.api.ts
			media.schema.ts
	fetcher.ts
	axios.ts
	registry.ts
	schema.base.ts
	types.base.ts
	route-factory.ts
	key-factory.ts
	hooks/
		use-api.ts
		use-prefetch-api.ts

lib/
	config/             # Environment validation and parsing (env.ts)
	constants/          # Route configs (routes.ts)
	utils/              # cn, jsend, secure-api-route, get-query-client, nuqs, media-helper, animations, format-date, logger

hooks/
	use-media-query.ts  # Responsive breakpoint hooks

store/
	editor/             # Editor Zustand store & schema
	onboarding/         # Onboarding Zustand store & schema
	play/               # Active play Zustand store & schema

generated/            # Compiled Prisma clients
prisma/               # Database migrations and schema.prisma
public/
proxy.ts              # Route proxy middleware (Next.js 16 pattern)
```

### Component Architecture (Server/Client Split)
For any page that requires SEO metadata, the route folder will contain **two** files:
1. `page.tsx` (Server Component): Exports the Next.js `metadata` object, performs pre-hydration calls, and renders the client component.
2. `client.tsx` (Client Component): Uses `"use client"` and contains the actual interactive UI, imported as `<ClientPage />` by `page.tsx`.

### Rules of Thumb
- Features own their UI, state, schema, and services; shared UI lives in `components/`.
- External integrations go in `adapters/` and are consumed by features or server services.
- Server components should call `await connection()` to force route generation / hydration safety.
- API responses must use standard JSend envelopes (`lib/utils/jsend.ts`) to maintain a consistent API schema.
- File names use kebab-case (no camelCase).

### Module Endpoint Example

```typescript
// data/modules/user/user.schema.ts
import { z } from 'zod';
export const PublicUserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

```typescript
// data/modules/user/user.api.ts
import { authClient } from '@/adapters/auth/client';
// Queries/mutations logic using fetcher or authClient directly
export const publicLogin = async (data: typeof PublicUserLoginSchema._type) => {
  return await authClient.signIn.email(data);
};
```

### data Glossary
- `fetcher.ts`: Shared wrapper for request execution, custom `ApiError` mapping, and Zod response validation.
- `axios.ts`: Configured axios instances (auth/public) with server-side cookie forwarding.
- `registry.ts`: Central registry mapping API keys (e.g. `public:user:login`) to operations.
- `schema.base.ts`: Shared base Zod schemas (IDs, pagination, common envelopes, role enums).
- `types.base.ts`: Shared types for query/mutation config and inference.
- `route-factory.ts`: Shared API route generators matching registry keys.
- `key-factory.ts`: Standardized query keys mapping registry keys to React Query caches.
- `hooks/use-api.ts`: React Query client query/mutation hook factory.
- `hooks/use-prefetch-api.ts`: SSR query prefetcher helper.

## Test Strategy (TDD)
### Tooling
- Unit/integration: deferred until pre-deployment
- API tests: deferred until pre-deployment
- E2E: Playwright

### Test Pyramid Targets
- Unit tests: TBD
- Integration tests: TBD
- E2E tests: focus on critical user flows

### Batch 1 (Pilot) Test Scope
**User management/auth/onboarding**
- E2E: sign up -> onboarding -> dashboard entry; sign in -> landing -> session list.

**Legal and consent**
- E2E: consent banner display, accept/deny flow, tracking enabled/disabled.

**Admin basics**
- E2E: admin login -> module approval -> status updated.

**Placeholder app UI**
- E2E: explore -> module details placeholder -> sessions placeholder.

### Batch 2 Test Scope
**Sessions and module play**
- E2E: teacher starts session -> student joins -> completes checkpoints -> leaderboard visible.

**Performance (TBD targets)**
- Lighthouse/Playwright measurements for LCP, TTI, and module start time.
- Rendering FPS sampling for lab canvas (placeholder thresholds until renderer decision).

### Non-Functional Tests
- Accessibility: basic WCAG checks for key pages (auth, explore, session join).
- Security: auth required for protected routes; admin route guards.

### Test Data and Environments
- Seed data: 4 predefined modules as fixtures; sample sessions with checkpoints.
- Mocks: external email, analytics, and S3/RDS in local test env.

### CI Recommendations
- Run E2E on main branch or nightly to control runtime.

### Assumptions / TBD
- Performance targets to be defined for tablet devices and low network conditions.
- Renderer decision (2D/3D) will determine final performance test thresholds.
- Unit/integration testing strategy will be defined before production hardening.
