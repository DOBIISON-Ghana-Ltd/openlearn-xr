# Page Specification: Play Page and Interactive Canvas

## 1. Requirements & Scope
- **Play Layout (`/play/[mode]/[id]`):**
  - Fullscreen layout with no main app shells/navigation.
  - **Top Portion (16:9 aspect ratio container):** Houses the 3D lab environment rendered via React Three Fiber (R3F) and Three.js. Supports future fallback to 2D vector layouts.
  - **Bottom Portion:** Dynamic interactive card showing current instruction step or checkpoint question.
- **Interactive Canvas Engine:**
  - Loads JSON module configs defining models, cameras, positions, and interactable nodes.
  - Users interact with the environment (e.g., mixing chemical reagents, adjusting heat) to complete instructions.
- **Checkpoints:**
  - Standardized multi-choice questions assessing comprehension.
  - Submitting an answer locks input and evaluates correctness.
- **Points & Unlocking:**
  - Unlocked states and point values update upon completion.
  - Anonymous progress writes to local storage. Signed-in progress writes to the database.

---

## 2. UI & Design Guidelines
- **Canvas Container:** Must be responsive, centered, and scaled in a 16:9 ratio to prevent warping on varying screen dimensions (mobile portrait vs tablet landscape).
- **Checkpoints Overlay:** Vibrant colors (green for success/correct, red for incorrect), clean hover animations on option cards, and high contrast text for accessibility.

---

## 3. API & Data Layer
- **Zustand State Store (`store/play`):**
  - Manages active simulation state: `currentStepIndex`, `checkpointQuestions`, `userAnswers`, `score`, and `labInteractions`.
- **Endpoints:**
  - `GET /api/modules/[id]` — Fetches raw lab module definitions and visual assets.
  - `POST /api/progress/complete` — Submits score, logs points, streaks, updates global leaderboard (if signed in).

---

## 4. TDD / Test Cases (Playwright & Component)
- **R3F Canvas Initialization:**
  1. Navigate to `/play/modules/chem-1`.
  2. Verify Canvas wrapper loads and WebGL context initializes.
  3. Verify R3F scene contains specified objects from mock module database.
- **Checkpoint Question Submission:**
  1. Trigger checkpoint overlay in test suite.
  2. Click correct option. Click Submit.
  3. Verify display turns green, displays success message, and increments Zustand score cache.
  4. Verify "Next Step" button becomes clickable.
- **Solo Play Progress DB Write:**
  1. Login as student. Navigate to `/play/library/chem-1` (first module).
  2. Complete all checkpoints and finish module.
  3. Verify database `UserStats` has points added, and `UserProgress` for `chem-1` marks as `COMPLETED`.
  4. Verify global leaderboard matches new score.
- **Anonymous Play Progress Storage:**
  1. Close active session (play anonymously).
  2. Play and complete `chem-1`.
  3. Verify `localStorage` contains `unlocked: ["chem-2"]` and `completed: ["chem-1"]`.
  4. Verify `/library` page marks `chem-1` as checked and `chem-2` as unlocked.

