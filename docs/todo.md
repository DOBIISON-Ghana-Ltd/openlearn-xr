# Project Todo & Immediate Handoff Backlog

This document tracks completed tasks, active implementations, and deferred tasks for incoming developers.

---

## 🚀 Active Priority: Onboarding & Monetization Milestone

### 1. Complete Onboarding Licensing Endpoints
- [ ] **Task**: Finish the GET and PATCH implementation in `src/app/api/app/onboarding/licensing/route.ts`.
- [ ] **GET Flow**:
  - Verify if user owns an organization.
  - Check for any pending transactions in DB, verify status with Paystack (`GET https://api.paystack.co/transaction/verify/:reference`), and update DB status.
  - Return `organizationName`, `organizationId`, `shouldFinishTransaction`, `accessCode`, and `finishedSubscription`.
- [ ] **PATCH Flow**:
  - If no organization exists, create new `Organization`, add user as `owner`, and set `session.activeOrganizationId`.
  - If `plan === "FREE"`, create/update `Subscription` record with `tier: "FREE"`, `status: "ACTIVE"`.
  - If `plan !== "FREE"`, call Paystack initialize API with metadata (`organizationId`, `userId`) and record a pending `Transaction` with `accessCode` and `reference`.

### 2. Wire Onboarding Frontend Tabs to Paystack
- [ ] **Task**: Connect `src/app/auth/onboarding/tab.student.lisense.tsx` and `tab.teacher.lisense.tsx` with `@paystack/inline-js`.
- [ ] **Context**: When user selects a paid plan, open the Paystack inline popup using the returned `accessCode`. On payment completion callback, advance to `tab.final.tsx` and mark `user.onboarded = true`.

### 3. Implement Onboarding School Join by Code Logic
- [ ] **Task**: Implement the school search, join code / invitation resolution, and organization membership association logic in `PATCH /api/app/onboarding/join`.
- [ ] **Context**: Handle verifying join codes against pending invitations or active schools, creating/updating member roles, and setting active organization session context.

---

## 📋 General Backlog & Analytics

### 4. Teaching Analytics Detail Page UI Implementation
- [ ] **Task**: Connect `src/app/teaching/(group)/analytics/[id]/client.tsx` to active endpoints:
  - Session Info: `ses:analytics:get:info`
  - Session Metrics: `ses:analytics:get:metrics`
  - Session Players List
  - Session Checkpoint Questions List

### 5. Session Analytics Info Schema Expansion
- [ ] **Task**: Extend `ZLiveSession.pick({})` in `SesAnalyticsGetInfo` (`src/data/api/ses/ses.schema.ts`) as more session-level metadata fields are required for the analytics page.
- [ ] **Target Endpoint**: `GET /api/ses/analytics/[id]/info` (`src/app/api/ses/analytics/[id]/info/route.ts`).

### 6. Consolidate Repetitive Session Players Endpoints
- [ ] **Task**: Consolidate repetitive session players endpoints (`ses:session:get:players` and `ses:analytics:get:players`) into a shared unified endpoint or service.

### 7. Implement Remaining Play Route Analytic Event Logs
- [ ] **Task**: Wire client-side `sim:session-analytics:post:one` event dispatches across remaining simulation play tabs:
  - **Pre-Test**: Dispatch `"pre-test:changed"` in `src/app/p/[...slug]/flow.engage.tsx` when answering pre-assessment questions.
  - **Tab Navigation**: Dispatch `"tab:changed"` in `src/app/p/[...slug]/flow.tsx` when transitioning between tabs.
  - **Simulation Controls**: Dispatch `"control:changed"` in `src/components/control-blocks/dynamic-lab-panel.tsx` when adjusting sliders/toggles.

---

## ✅ Completed Milestones

- [x] **Host Result Flow Metrics Migration**: Replaced client-side metric calculation with server query `ses:analytics:get:metrics`.
- [x] **Project-Wide `cn()` Conditional Class Corrections**: Audited and normalized all `cn()` utility usage.
- [x] **Migrate `(new)` Directory Contents to Root**: Consolidated all components and routes into standard directories.
- [x] **Prisma Database Schema Refactoring**: Added User onboarding profile fields, 1-to-1 Organization-to-Subscription relation, and 1-to-many Transaction links.
- [x] **Paystack Webhook Handler**: Implemented HMAC SHA512 signature validation and event routing in `/api/webhoooks/paystack`.
