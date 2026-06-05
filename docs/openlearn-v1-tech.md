# Technical Design: OpenLearn V1

> Status: COMPLETE
> Last updated: 2026-06-03

## Overview
OpenLearn V1 is a web-based educational platform delivering interactive 3D science labs. It is built as a Next.js application using React Three Fiber (R3F) for 3D lab simulations, Postgres for data persistence, and Better Auth for user management. The MVP focuses on predefined modules with a flexible data schema adaptable for future 2D fallbacks.

## Key Components
1. **Lab Renderer (UI/Domain):** An R3F-based canvas that interprets module definitions and renders 3D interactive environments.
2. **Session Engine (Domain/Service):** Manages the lifecycle of an untimed, Kahoot-style session, tracking participant checkpoints and retakes based on host config.
3. **Module Schema (Data):** Agnostic JSON structure representing a lab environment, checkpoints, and assets.
4. **Auth & Identity (Adapter):** Manages registered users vs. anonymous session participants.

## API Design
- **REST/JSend Envelope:** All `/api/*` routes return a standardized `{ status, data, message }` format.
- **Client Fetching:** React Query wrapped around a standardized Axios instance (`fetcher.ts`).

## Data Flow
1. **Direct Play:** Registered user fetches `Module` -> initializes Lab Renderer -> completes checkpoints -> server records score.
2. **Session Play:** Host creates `Session` (sets config) -> Server generates join code -> Participants join -> Server tracks real-time progress via polling -> Host ends session -> Leaderboard generated.

## Implementation Details
- **3D vs 2D (Deferred):** The module is represented by a JSON lab object containing properties (e.g., 3D model positions, IDs). In the future, this can include 2D vector properties and a type flag. The architecture flows from data -> Zustand state -> renderer (similar to tldraw). The exact schema for lab objects and checkpoints is deferred to prioritize user management and platform shell.
- **Session State:** For MVP, short-polling via React Query (every 3-5s) is acceptable for leaderboard updates to avoid WebSocket complexity initially.
- **Play Route Layout (`/play/[type]/[id]`):** This fullscreen route has no app shell. It will feature the interactive 3D lab canvas in a video aspect ratio (e.g. 16:9) at the top of the screen. Underneath the canvas, the checkpoint questions will be displayed.

## Stack and Core Libraries
- Framework: Next.js
- Database: Postgres (via Prisma)
- Auth: Better Auth
- Validation: Zod
- Data fetching: React Query
- State: Zustand
- Query params: nuqs
- Forms: React Hook Form + @hookform/resolvers
- UI: Base UI (unstyled)
- Animations: Motion
- Email: react-email + Resend
- Uploads: @better-upload to S3
- IDs: nanoid
- Slugs: @sindresorhus/slugify
- Conditional rendering: ts-pattern

## Project Structure and Separation of Concerns
- Next.js App Router with `app/` at repo root (same level as `public/`, not under `src/`).
- Feature-based folders with shared layers split by responsibility (UI, state, data, domain, infra).

### Suggested Folder Structure
This combines feature modules (canvas editor, sessions, forms) with adapters/integrations (auth, email, uploads). It uses Next.js Route Groups for layout management.

```
app/
	(marketing)/      # Landing page, /legal/terms, /legal/privacy, /legal/cookies
	(auth)/           # /login, /register, /forgot-password, /reset-password, /verify-email
	(app)/            # Core app shell: /app, /app/modules, /app/sessions, /app/community, /app/my-plays
	(admin)/          # /admin, /admin/analytics, /admin/modules, /admin/users (V1 placeholders for others)
	play/             # /play/[type]/[id] unified fullscreen route
	api/
```

### Component Architecture (Server/Client Split)
For any page that requires SEO metadata, the route folder will contain **two** files:
1. `page.tsx` (Server Component): Exports the Next.js `metadata` object and renders the client component.
2. `client.tsx` (Client Component): Uses `"use client"` and contains the actual interactive UI, imported as `<ClientPage />` by `page.tsx`.

components/
	ui/                 # shared, unopinionated UI primitives
	forms/              # shared form controls + RHF bindings
	layout/             # nav, shell, page scaffolding

features/
	auth/
		components/
		hooks/
		schema/
		services/
		tests/
	sessions/
		components/
		hooks/
		schema/
		services/
		tests/
	modules/
		components/
		hooks/
		schema/
		services/
		tests/
	canvas-editor/
		components/
		hooks/
		schema/
		services/
		tests/
	rich-text/
		components/
		plugins/          # tiptap plugins and extensions
		schema/
		tests/

adapters/
	auth/               # better-auth integration
	email/              # react-email + resend
	analytics/          # posthog + google tracking
	uploads/            # @better-upload + s3
	db/                 # prisma client + helpers

data/
	modules/
		{module}/
			{module}.api.ts
			{module}.schema.ts
	fetcher.ts
	axios.ts
	registry.ts
	schema.base.ts
	types.base.ts
	hooks/
		use-api.ts
		use-prefetch-api.ts

lib/
	config/             # env parsing, runtime config
	constants/
	utils/
	logging/

server/
	services/           # server-only business logic
	actions/            # server actions (if used)
	api/                # route handlers, controllers

styles/
prisma/
public/
```

### Rules of Thumb
- Features own their UI, state, schema, and services; shared UI lives in `components/`.
- External integrations go in `adapters/` and are consumed by features or server services.
- Server-only logic lives in `server/` and never imports from client-only code.
- React Query handles caching; avoid a custom `cache/` folder unless a separate cache layer is required later.
- API responses should use a JSend-style envelope for consistency.
- File names use kebab-case (no camelCase).

### Module Stub Example (No Logic)
This is just the shape, so there is no guessing when implementing later.

```
data/
	modules/
		session/
			session.api.ts
			session.schema.ts
```

```typescript
// data/modules/session/session.api.ts
// register queries/mutations here using the shared wrapper and registry
export default {};
```

```typescript
// data/modules/session/session.schema.ts
// export Zod schemas for request/response here
export default {};
```

### data Glossary
- `fetcher.ts`: shared wrapper for request execution and schema validation.
- `axios.ts`: configured axios instances (auth/public) and interceptors.
- `registry.ts`: registers module configs for consistent query/mutation access.
- `schema.base.ts`: shared base Zod schemas (IDs, pagination, common shapes).
- `types.base.ts`: shared types for query/mutation config and inference.
- `hooks/use-api.ts`: React Query hook factory for queries/mutations.
- `hooks/use-prefetch-api.ts`: SSR/route prefetch helper for query hydration.

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

## Migration Plan
{If applicable, how to migrate from existing system}
