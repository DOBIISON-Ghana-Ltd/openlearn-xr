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

### 5. Project-Wide `cn()` Conditional Class Corrections
- [ ] **Task**: Audit and update all `cn()` calls across the codebase to ensure the default/falsy styles are defined in the base string and truthy overrides are placed in the conditional object (e.g. `cn("base-style default-style", { "override-style": condition })`).

---

### 6. Migrate `(new)` Directory Contents to Root
- [ ] **Task**: Move all routes, pages, and components from the `(new)` folder structure (e.g., `src/app/(new)/` and `src/components/(new)/`) directly to the root/standard directories since the new design is now the main implementation.

---

### 7. Project-Wide Migration to Tailwind CSS v3
- [ ] **Task**: Perform a project-wide migration to Tailwind CSS v3 to ensure robust cross-browser compatibility and support for older browser versions.

---

### 8. Implement Remaining Play Route Analytic Event Logs
- [ ] **Task**: Wire client-side `sim:session-analytics:post:one` event dispatches across the remaining simulation play tabs and interactions:
  - **Pre-Test**: Dispatch `"pre-test:changed"` in [`flow.engage.tsx`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/%28new%29/p/%5B...slug%5D/flow.engage.tsx) when a student answers a pre-assessment question (`{ questionIndex, selectedIndex, isCorrect }`).
  - **Tab Navigation**: Dispatch `"tab:changed"` in [`flow.tsx`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/%28new%29/p/%5B...slug%5D/flow.tsx) when transitioning between tabs (`{ tabIndex }`).
  - **Simulation Controls**: Dispatch `"control:changed"` in [`dynamic-lab-panel.tsx`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/components/%28new%29/control-blocks/dynamic-lab-panel.tsx) / [`flow.explore.internal.tsx`](file:///d:/delmac/dobiison/projects/open-learn-xr/src/app/%28new%29/p/%5B...slug%5D/flow.explore.internal.tsx) when learners adjust sliders, numbers, or toggles (`{ controlKey, controlValue }`).

