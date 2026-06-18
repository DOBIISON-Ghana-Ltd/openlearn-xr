# PRD: OpenLearn V1

> Status: LIVING — aligned with codebase implementation patterns (updated 2026-06-07)
> Last updated: 2026-06-07

## Table of Contents
- [Problem Statement](#problem-statement)
- [Goals and Non-Goals](#goals-and-non-goals)
- [Success Criteria](#success-criteria)
- [Scope](#scope)
- [Requirements](#requirements)
- [User Flows](#user-flows)
- [Implementation Plan](#implementation-plan)

---

## Problem Statement
Secondary schools in Ghana often lack science labs due to equipment and material costs, which makes it hard to teach and learn abstract science concepts. OpenLearn provides interactive lab simulations and checkpoints so teachers can assess understanding without physical lab infrastructure.

## Goals and Non-Goals
### Goals
- Provide interactive science modules that improve student confidence and understanding of abstract topics.
- Enable licensed teachers or schools to run classroom sessions and assess learner strengths via real-time checkpoints and leaderboards.
- Offer a fast, intuitive V1 experience on tablets and low-network environments.
- Deliver a usable web MVP with onboarding, legal compliance, admin basics, and placeholder app UI.
- Establish OpenLearn as a Digital Public Good (DPG): open-source on GitHub, enabling schools to self-host, upload custom curriculum, and run their own local models.
- Support high-quality curated curriculum modules verified by GES (Ghana Education Service) on the official openlearn.org hosted site, free for all students.

### Non-Goals
- No module editor or curriculum parsing UI for regular users on the official `openlearn.org` hosted platform (admin-only).
- No desktop/mobile native applications (web-first focus).

## Success Criteria
- Students report confidence using OpenLearn modules in feedback surveys.
- Tutors find the modules valuable for curriculum-aligned instruction.
- Modules effectively assess understanding of abstract concepts (teacher feedback + checkpoint performance signal).
- V1 is rated easy and intuitive to use by teachers and students.
- Acceptable performance on tablets under low network conditions.

## Scope
### In Scope
- Web platform with authentication, onboarding, and organization management.
- **Anonymous Play:** Users can play science modules directly without registering or logging in.
- **Signed-In Rewards:** Registered users earn points, streaks, and badges, and participate in a global leaderboard.
- **Library & Modules Views:**
  - *Library (Syllabus Pathway):* Sequential curriculum progression (e.g., Chemistry Form 1), unlocking lab modules one-by-one.
  - *Modules (Free Search):* A directory of individual modules, enabling flexible search and direct play by subject, level, or topic.
- **Licensing & Organization:**
  - Integration with Better Auth Organization Plugin.
  - **Three Licensing Tiers:**
    1. *Solo Teacher Tier:* Tied to 1 user ID's personal organization (1 seat), permitting a cap of active concurrent classroom sessions (e.g., 3).
    2. *Department Tier:* A seat-based pack (e.g., up to 5 or 10 teachers) who share an organization workspace using the Better Auth organization plugin.
    3. *Institutional / Enterprise Tier:* A flat-rate license tied to a school organization. Includes unlimited teacher accounts using domain wildcard matching (e.g., any signup with `@school.edu.gh` automatically gets upgraded to host/teacher status in the organization).
  - License validation required for creating classroom sessions.
  - Configurable/mockable payment gate for self-hosted instances; Stripe integration for openlearn.org.
- **Classroom Sessions:**
  - Real-time monitoring of session checkpoints and player performance.
  - Anonymous session join via code or QR.
  - Localized session-specific leaderboards.
- Landing/marketing site detailing licensing options and the self-hosting setup program.
- Legal pages: privacy, terms, cookie consent.
- Admin panel for application admins to add, edit, and update modules, manage curriculum, and oversee licenses/organizations.

### Out of Scope
- User/teacher-facing module editor on `openlearn.org` (admin-only).
- Custom AI models run directly on `openlearn.org` resources for end-users (self-hosted versions handle their own local model integrations).
- Native desktop/mobile app packages.

## Requirements
### Functional Requirements
- **Play Access:** Anyone can play modules without signing in.
- **Gamification:** Authenticated users earn points, maintain streaks, get badges, and join the global leaderboard.
- **Library Progress:** Unlocking progress in the sequential Library pathway is saved in `localStorage` for anonymous users and synced to the database upon user registration/login.
- **Licensing and Organization (Better Auth Organization Plugin):**
  - Every registered user belongs to a default personal Organization hosting their solo license details.
  - **Solo Teacher License:** Grants session-creation permissions up to a concurrent limit (e.g., 3 active sessions).
  - **Department License:** Bound to a team organization with a seat limit configuration (e.g., 5 or 10 teacher accounts).
  - **Institutional License:** Tied to a school organization. Allows wildcard email domain mapping (e.g., `@school.edu`) so any user signing up with a matching domain is automatically mapped as a licensed teacher under that school's organization.
  - An active license (with available seats and session allowance) is required to launch `ClassroomSession` endpoints.
- **Real-Time Sessions:**
  - Teachers/hosts can create sessions, generate join codes/QRs, and share links.
  - Participants join anonymously (supplying a display name or student ID).
  - The teacher dashboard collects checkpoint responses in real time using client-side short-polling (every 2-3 seconds) and displays performance metrics.
  - Leaderboard is session-bound for the dashboard.
- **Curriculum & Modules:** Only application admins can create, import, or update modules. Modules contain metadata columns (subject, level, sequence order) and a JSON data blob containing checkpoints and R3F visual configs.
- **Open-Source DPG Architecture:**
  - *Standard Pluggable Interfaces:* Avoid hardcoded infrastructure dependencies. Use adapters/provider interfaces so self-hosters can configure AI (`openai`/`ollama`), storage (`local`/`s3`), database, and caching (`redis`/`in-memory`) services in environment variables.
  - *Docker Compose Quick Start:* Deliver a ready-to-run `docker-compose.yml` defining a "Default Stack" (Next.js app, Postgres, Redis, and MinIO for local S3-compatible document uploads).
  - *Enterprise Compatibility:* Allow massive production deployments to swap docker containers for fully-managed cloud services (e.g. AWS RDS, S3, Redis Cluster, Private LLMs) using standard env configs.

### Non-Functional Requirements
- Must load and run smoothly on tablet devices with low network conditions.
- Comply with privacy and cookie consent requirements.
- Instrumentation must respect consent before tracking cookies.
- Data architecture must support the current 3D R3F renderer and be adaptable for a future 2D fallback renderer.
- Licensing, billing, and organization logic must be easily mockable/decoupled for open-source self-hosted systems.

## User Flows
- **Anonymous User:** Visits landing page -> clicks Play -> searches by subject (Modules View) or plays sequentially (Library Syllabus pathway, unlocking saved in localStorage).
- **Teacher (Solo Teacher Tier):** Creates account (auto-creates personal organization with 1 seat) -> purchases Solo License -> starts classroom session from a module (max 3 active concurrent sessions) -> shares join code -> monitors pupil checkpoint progress in real time via short-polling -> reviews session leaderboard.
- **Department Lead (Department Tier):** Purchases Department Pack -> creates Department Organization -> invites up to 5/10 department teachers as organization members. Members can start unlimited concurrent sessions.
- **School Admin / Teacher (Institutional Tier):** School purchases Institutional License -> Admin sets domain wildcard matching (e.g. `@school.edu.gh`). Any teacher signing up with that domain is auto-added as a licensed host under the school Organization and can create classroom sessions instantly.
- **Student (Session Play):** Receives code/link -> joins anonymously with display name -> plays the lab module -> completes checkpoints -> scores are reported to the teacher's session page.
- **Signed-in Student:** Plays solo modules (Library pathway or Modules search) -> achievements (points, streaks, badges) are persisted -> checks rank on global leaderboard.
- **Application Admin:** Logged-in admin -> accesses Admin Panel -> creates/edits modules, sets curriculum ordering, updates GES-verified modules, and manages organizations/licenses.

## Current Implementation Status

As of June 7, 2026, the codebase has been initialized with manual structure adjustments:
- **Auth & Identity:** Setup complete with Better Auth, custom user roles (user, editor, admin), signup, Google OAuth, and email OTP verification.
- **Onboarding:** A 3-step client-side onboarding flow is scaffolded, awaiting server-side completion logic integration.
- **Landing & Legal:** Main marketing landing page, privacy, cookie consent banner, terms, and cookies info pages are structured.
- **Admin Panel:** Core user/module dashboards and statistics are scaffolded, using role-based routing gates.
- **App Shell & Layouts:** Routes are gated using a custom cookie-cache proxy middleware (`proxy.ts`). Global app shells are referenced but require final integration/linking.
- **Data Layer:** Strong types, route/key factories, custom axios wrappers, and `useApi` react-query hooks are ready and integrated.

## Implementation Plan
- **Batch 1 (Pilot - Substantially Complete):** Authenticated user management, role-based access control, onboarding framework, legal compliance, and initial admin/marketing pages.
- **Batch 2 (Pending):** Core educational app flows — integrate active Zustand play/onboarding/editor stores, complete 3D R3F lab play canvas components, implement checkpoints, real-time leaderboard sessions via polling, and replace the placeholder app shells.

## Page-Specific Specifications
To guide modular TDD development, details on requirements, layout, APIs, and test scripts are split into feature documents:
- [Landing and Legal Pages](file:///d:/delmac/dobiison/projects/open-learn-xr/docs/pages/landing-and-legal.md)
- [Auth and Onboarding](file:///d:/delmac/dobiison/projects/open-learn-xr/docs/pages/auth-and-onboarding.md)
- [Licensing and Billing](file:///d:/delmac/dobiison/projects/open-learn-xr/docs/pages/licensing-and-billing.md)
- [Library and Modules Pages](file:///d:/delmac/dobiison/projects/open-learn-xr/docs/pages/library-and-modules.md)
- [User Dashboard](file:///d:/delmac/dobiison/projects/open-learn-xr/docs/pages/dashboard.md)
- [Play Page and Interactive Canvas](file:///d:/delmac/dobiison/projects/open-learn-xr/docs/pages/play-and-canvas.md)
- [Classroom Monitoring and Session Dashboard](file:///d:/delmac/dobiison/projects/open-learn-xr/docs/pages/classroom-monitoring.md)
