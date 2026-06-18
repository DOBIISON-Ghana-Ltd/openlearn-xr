# Page Specification: User Dashboard (Me)

## 1. Requirements & Scope
- **User Dashboard (`/me` route group):**
  - **Profile (`/me/profile`):** Renders user display name, avatar, global points, active play streak (days), and badges earned.
  - **Organization (`/me/organisation`):** UI allowing licensed users to view and switch between their Personal Organization (Solo license) and any joined School/Department Organizations.
  - **Activity (`/me/activity`):** Overview of recent interactions.
  - **History (`/me/history`):** Chronological list of past solo plays and completed modules.
  - **Sessions (`/me/sessions`):**
    - Lists active (live) and ended classroom sessions.
    - "Create Session" button opening a modal to generate a new `ClassroomSession`.
  - **License (`/me/license`):** Management interface for the user's current license tier, limits, and upgrade path.
- **Create Session Modal:**
  - Let host select a module.
  - Configuration inputs: allow retakes, session expiry time.
  - Validates active license and concurrent session constraints (e.g., blocks launch if Solo License has 3 active sessions running).
  - Generates a unique join code and routes to `/dashboard/sessions/[code]`.

---

## 2. UI & Design Guidelines
- **Layout:** Standard sidebar navigation (Dashboard, Library, Modules, Billing, Organizations).
- **Widgets:** Clean card layouts for Stats (Points, Streaks, Badges), with micro-animations when points or streaks increment.
- **Modal:** Dark background backdrop, smooth fade-in transition, form validation prompts using COSS UI library components.

---

## 3. API & Data Layer
- **Endpoints:**
  - `GET /api/users/me` — Fetches current user metadata, stats, and badges.
  - `GET /api/sessions` — Lists classroom sessions hosted by user.
  - `POST /api/sessions/create` — Validates license constraints and inserts a new `ClassroomSession`.
- **Better Auth Integration:**
  - `authClient.organization.list()` — Populates the switcher dropdown.
  - `authClient.organization.setActive()` — Updates user context workspace.

---

## 4. TDD / Test Cases (Playwright)
- **Stats Display Verification:**
  - Login as a user with 500 points, a 5-day streak, and 2 badges.
  - Verify stats load correctly and cards render proper values.
- **Organization Switcher:**
  - Select "Achimota School" organization from dropdown.
  - Verify active organization cookie/cache updates, and dashboard queries filter sessions belonging to that school.
- **Session Creation Validation:**
  - Attempt to create a session on a non-licensed account. Verify "Create Session" button is disabled or triggers a modal prompting license upgrade.
  - Login as a licensed Solo Teacher with 3 active sessions.
  - Attempt to launch a 4th. Verify modal displays warning and disables creation.
  - End one session, try again. Verify creation succeeds, inserts a new `ClassroomSession` row, and routes the host to the tracking dashboard.
