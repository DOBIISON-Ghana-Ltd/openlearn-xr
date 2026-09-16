# Project Todo & Deferred Tasks

This document tracks features, refactors, and architectural improvements deferred for future implementation.

---

## 📋 Backlog & Follow-ups

### 1. Host Result Flow Metrics Migration
- [ ] **Task**: Replace the client-side utility `calculateSessionMetrics(players, sessionInfo?.config?.maxAdmissions)` in [`flow.result.host.tsx`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/%28new%29/p/%5B...slug%5D/flow.result.host.tsx#L70) with the server-side API query `ses:analytics:get:metrics` (`/api/ses/analytics/[id]/metrics`).
- [ ] **Context**: Once verified, deprecate / clean up the client-side [`calculate-session-metrics.ts`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/lib/utils/calculate-session-metrics.ts) utility.

---

### 2. Session Analytics Info Schema Expansion
- [ ] **Task**: Extend the currently empty `ZLiveSession.pick({})` in `SesAnalyticsGetInfo` ([`ses.schema.ts`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/data/api/ses/ses.schema.ts)) as more session-level metadata fields are required for the analytics page.
- [ ] **Target Endpoint**: `GET /api/ses/analytics/[id]/info` ([`route.ts`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/api/ses/analytics/%5Bid%5D/info/route.ts)).

---

### 3. Teaching Analytics Detail Page UI Implementation
- [ ] **Task**: Connect [`src/app/(new)/teaching/(group)/analytics/[id]/client.tsx`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/%28new%29/teaching/%28group%29/analytics/%5Bid%5D/client.tsx) to active endpoints:
  - Session Info: `ses:analytics:get:info`
  - Session Metrics: `ses:analytics:get:metrics`
  - Session Players List
  - Session Checkpoint Questions List

---

### 4. Consolidate Repetitive Session Players Endpoints
- [ ] **Task**: Consolidate repetitive session players endpoints ([`ses:session:get:players`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/api/ses/sessions/%5Bid%5D/players/route.ts) and [`ses:analytics:get:players`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/api/ses/analytics/%5Bid%5D/players/route.ts)) into a shared unified endpoint or service.

---

### 5. Git Commit
- [ ] **Task**: Create conventional commits for the teaching analytics endpoints and UI refactors once testing is completed.
