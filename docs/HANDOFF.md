# OpenLearn XR — Master Project Handoff & Developer Guide

## 1. Project Overview
**OpenLearn XR** is an interactive, curriculum-aligned 3D WebGL science laboratory simulation and classroom teaching platform designed for Senior High School education (Ghana Education Service aligned) and global Digital Public Good (DPG) deployment.

---

## 2. Technology Stack & Key Libraries

| Domain | Technology / Library | Role / Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, React 19) | Fullstack application & API server routes |
| **Database & ORM** | PostgreSQL + Prisma ORM v7 (`@prisma/adapter-pg`) | Data layer with driver adapters and type-safe queries |
| **Authentication** | Better Auth (with Organization plugin) | Multi-tenant auth, session cookies, owner/member roles |
| **3D Rendering** | Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`) | High-performance WebGL interactive lab simulations |
| **UI & Design Tokens**| Tailwind CSS v4, `@base-ui/react`, GSAP | Accessible UI primitives and high-end animations |
| **State Management** | Zustand + TanStack React Query v5 | Client state stores and unified server state caching |
| **Realtime Sync** | Pusher (`pusher`, `pusher-js`) | Multiplayer classroom sync and live leaderboards |
| **Payments** | Paystack (`@paystack/inline-js`, REST API) | Subscription billing and transaction tracking |
| **Validation** | Zod v4 | Strict schema validation for API inputs, outputs, and JSON configs |

---

## 3. Project Directory Map

```text
├── prisma/
│   ├── schema.prisma              # Master database schema (Users, Orgs, Subs, Modules, Attempts)
│   ├── data.ts                    # 8 curriculum pilot modules and interactive configs
│   ├── seed.ts                    # Idempotent database seeder
│   └── migrations/                # Database migration history
├── src/
│   ├── adapters/                  # Infrastructure layer
│   │   ├── auth/                  # Better Auth server and client
│   │   ├── db/                    # Prisma client singleton (PrismaPg adapter)
│   │   ├── email/                 # SES, Resend, Console email adapters + templates
│   │   ├── realtime/              # Pusher server trigger and client subscription helpers
│   │   └── analytics/             # Google Analytics & PostHog provider
│   ├── app/                       # Next.js App Router
│   │   ├── (public)/              # Landing page, public collections, module discovery
│   │   ├── auth/                  # Login, Register, Password Reset, and Onboarding tabs
│   │   ├── p/[...slug]/           # 3D Simulation Player Engine (Engage, Explore, Checkpoint, Result)
│   │   ├── teaching/              # Teacher Classroom Hub, Session Host, Analytics
│   │   ├── profile/               # User account settings
│   │   └── api/                   # API Routes adhering to 5-Suite Taxonomy
│   │       ├── app/               # Core user, onboarding, licensing, catalog routes
│   │       ├── sim/               # Simulation progression, checkpoints, attempt verification
│   │       ├── ses/               # Live classroom session management and metrics
│   │       ├── admin/             # Curriculum administration & seeding
│   │       └── webhoooks/paystack # Paystack background lifecycle webhook handler
│   ├── components/                # Reusable React components
│   │   ├── common/                # Shared buttons, modals, badges, states
│   │   ├── control-blocks/        # Dynamic Lab Panel controls (Slider, Toggle, Number, Select)
│   │   └── simulations/           # Three.js 3D apparatus scenes (React Three Fiber)
│   ├── data/                      # API schemas & contracts
│   │   ├── schema.base.ts         # Base Prisma-to-Zod schema mirrors
│   │   ├── api/                   # Contracts for app, sim, ses, admin suites
│   │   └── route-factory.ts       # Unified API routing helper
│   ├── store/                     # Zustand stores (appStore, simStore, etc.)
│   └── lib/                       # Utilities (secureApiRoute, JSend, cn, env validation)
└── docs/                          # Architecture guides, specs, and roadmap
```

---

## 4. Architectural Pillars & Core Patterns

### A. The 5-Suite API Taxonomy
All API calls follow a strict 5-suite taxonomy:
1. `app:` — General consumer, profile, onboarding, catalog, and licensing routes.
2. `sim:` — 3D simulation exploration, checkpoint verification, and solo play attempts.
3. `ses:` — Live multiplayer classroom sessions, admissions, and metrics.
4. `editor:` — Internal module authoring and AI tooling.
5. `admin:` — Platform management and curriculum seeding.

### B. Simulation Flow Architecture (`/p/[...slug]`)
Simulations run through a unified 4-stage pipeline:
1. **Engage (`flow.engage.tsx`)**: Curiosity prompt & pre-assessment diagnostic quiz.
2. **Explore (`flow.explore.tsx`)**: Shared R3F `<Canvas>` + dynamic 3D apparatus + floating dynamic lab panel controls.
3. **Checkpoints (`flow.checkpoint.tsx`)**: Sequential comprehension questions verified against the server via `PlayAttempt`.
4. **Results (`flow.result.host.tsx` / `flow.result.player.tsx`)**: Accuracy summaries and XP distribution.

### C. Paystack Monetization & Subscriptions
- **1-to-1 Relationship**: Each `Organization` has exactly one `Subscription`.
- **1-to-Many Transactions**: Renewal and initial payments are recorded in `Transaction` records linked to `subscriptionId`.
- **Flow**:
  1. `GET /api/app/onboarding/licensing` verifies pending transactions or active subscriptions.
  2. `PATCH /api/app/onboarding/licensing` provisions Free subscriptions directly or triggers Paystack inline transactions for paid tiers.
  3. `POST /api/webhoooks/paystack` processes async status updates (`charge.success`, `subscription.create`, `invoice.update`, `subscription.disable`).

---

## 5. Local Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. Database migrations & generation
npm run prisma:generate
npm run prisma:migrate

# 3. Seed curriculum data (idempotent)
npm run prisma:seed

# 4. Run development server
npm run dev

# 5. Open Prisma Studio (Database GUI)
npm run prisma:studio
```

---

## 6. Immediate Next Steps for Incoming Developer
1. **Complete Onboarding Licensing Logic** ([src/app/api/app/onboarding/licensing/route.ts](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/api/app/onboarding/licensing/route.ts)):
   - Complete the response payload in `GET` and organization/subscription upsert in `PATCH`.
2. **Wire Onboarding UI Payment Trigger** ([src/app/auth/onboarding/tab.student.lisense.tsx](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/auth/onboarding/tab.student.lisense.tsx) and [tab.teacher.lisense.tsx](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/auth/onboarding/tab.teacher.lisense.tsx)):
   - Trigger Paystack popup checkout on plan selection and advance to `tab.final.tsx` upon success.
3. **Connect Teaching Analytics Detail UI** ([src/app/teaching/(group)/analytics/[id]/client.tsx](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/teaching/%28group%29/analytics/%5Bid%5D/client.tsx)):
   - Connect active server metrics (`ses:analytics:get:metrics`) to charts and player score tables.
