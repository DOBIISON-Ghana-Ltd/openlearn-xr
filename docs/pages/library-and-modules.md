# Page Specification: Library and Modules Pages

## 1. Requirements & Scope
- **Library Page (`/library`):**
  - Displays the sequential syllabus pathway (e.g., Chemistry Form 1 -> Form 4).
  - Renders modules sequentially as a roadmap or linear timeline.
  - Module N is locked until Module N-1 is marked `COMPLETED` in the database (or `localStorage` if anonymous).
  - Subject and grade level filters load the matching syllabus pathway.
- **Modules Page (`/modules`):**
  - Searchable directory of all individual science modules.
  - Users can search by title, topic, or subject and instantly play any module (no sequential locks).
  - Renders as a card grid with search bars and filter tags.
- **Progression Persistence:**
  - *Anonymous Users:* Progress in `/library` is stored in browser `localStorage`.
  - *Signed-In Users:* Progress is stored in the database. Syncs local completions upon sign-in.

---

## 2. UI & Design Guidelines
- **`/library` Layout:** Game-map node connector design. Completed nodes show green badges, active nodes show glowing borders, locked nodes are grayed out with a padlock.
- **`/modules` Layout:** Standard grid card layout. Top header features an active search input and dropdown filter chips for fast, visual queries.

---

## 3. API & Data Layer
- **Endpoints:**
  - `GET /api/modules` — Fetches modules catalog for `/modules` with search queries.
  - `GET /api/progress` — Retrieves sequential `UserProgress` completions for `/library`.
  - `POST /api/progress/sync` — Merges local `localStorage` progress to database.

---

## 4. TDD / Test Cases (Playwright)
- **Modules Grid Search:**
  - Navigate to `/modules`.
  - Search for "Acid". Verify result count updates and renders matching cards.
- **Library sequential progression:**
  - Navigate to `/library` as a fresh anonymous visitor.
  - Verify node 1 is unlocked, node 2 is locked.
  - Complete node 1. Navigate back to `/library`.
  - Verify node 2 is now unlocked.
- **Header Navigation:**
  - Verify that the application header contains two separate clickable navigation items: **Library** (linking to `/library`) and **Modules** (linking to `/modules`).
