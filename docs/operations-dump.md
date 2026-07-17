# OpenLearn XR: Interactive Lab, Live Session, & Analytics Specification

This document details the system design, database schemas, and architectural patterns for the **Interactive 3D Engine**, the **Live Session/Multiplayer Layer (Kahoot-Style Lobby)**, the **Leaderboard & Analytics Suite**, and the **Pilot Implementation Strategy** for OpenLearn XR.

---

## 1. Interactive 3D Canvas Architecture (Rive-Style Pipeline)

### 1.1 The Concept
Instead of statically rendering 3D environments, the canvas operates as an **interactive state machine** similar to Rive. 
* The database stores an `interactiveConfig` JSON object containing the scene nodes, animations, and exposed controls/inputs (triggers, range sliders, toggles).
* Changing an input triggers a state change, which executes a timeline animation, updating the WebGL canvas.

### 1.2 Tech Stack Pipeline
The runtime data flows through a strict unidirectional pipeline:
```
[Database (interactiveConfig JSON)]
               │
               ▼
[Zustand State Store (Exposes reactive controls/inputs)]
               │
               ▼
[GSAP Tweening Engine (Interpolates coordinates/states smoothly)]
               │
               ▼
[Three.js / React Three Fiber (Renders the 3D WebGL Scene)]
```

### 1.3 Schema Updates
In `ModuleVersion`, we rename the generic `simulationData` property to `interactiveConfig` to represent this Rive-like schema.

```prisma
// Rename: simulationData -> interactiveConfig
model ModuleVersion {
  id                String            @id @default(cuid())
  moduleId          String
  versionNumber     Int
  branchedFromId    String?
  status            String            @default("DRAFT")
  
  // Rive-like interactive schema: assets, scene hierarchy, exposed inputs, triggers
  interactiveConfig Json              
  
  changeNote        String?
  createdById       String
  publishedAt       DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  module            Module            @relation("ModuleVersions", fields: [moduleId], references: [id], onDelete: Cascade)
  branchedFrom      ModuleVersion?    @relation("VersionBranch", fields: [branchedFromId], references: [id])
  branches          ModuleVersion[]   @relation("VersionBranch")
  publishedFor      Module?           @relation("PublishedVersion")
  checkpoints       ModuleCheckpoint[]
  editorChat        EditorChat?
  sessions          LiveSession[]
  moduleProgress    ModuleProgress[]

  @@unique([moduleId, versionNumber])
  @@index([moduleId])
  @@index([status])
  @@map("module_version")
}
```

---

## 2. Checkpoints, Questions, & XP Dilution Algorithm

A complete module consists of the **3D interactive lab scene** paired with **chronological checkpoints**. 

### 2.1 Checkpoint Specifications
Each checkpoint is presented in the editor sidebar alongside the 3D canvas:
* **Question types supported:** True/False, Multiple Choice (A, B, C, D).
* **Properties:** Question text, options JSON list, correct answer key, points weight, and ordering index (`orderIndex`).

```prisma
model ModuleCheckpoint {
  id              String   @id @default(cuid())
  moduleVersionId String
  orderIndex      Int      // Sequential order of checkpoint in lab flow
  question        String
  options         Json     // [{label: "A", text: "...", isCorrect: true}]
  correctAnswer   String   // The correct answer option/key (e.g., "A" or "true")
  points          Int      @default(10) // Base points weight
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  moduleVersion      ModuleVersion       @relation(fields: [moduleVersionId], references: [id], onDelete: Cascade)
  sessionCheckpoints SessionCheckpoint[]

  @@index([moduleVersionId])
  @@map("module_checkpoint")
}
```

### 2.2 Points & XP Dilution Algorithm
To prevent users from "farming" XP by repeatedly completing the same quick lab, final points are computed using a time-decaying dilution formula:

$$\text{Points Earned} = \text{Base Points} \times \left( \frac{1}{\text{Total Plays} ^ \lambda} \right)$$

* $\text{Base Points}$: Defined on the `ModuleCheckpoint` (e.g., 10 points).
* $\text{Total Plays}$: Retrieved from `ModuleProgress.totalPlays` for the active user.
* $\lambda$ (Dilution factor): Typically set to `0.5`, resulting in diminishing returns on consecutive attempts:
  * Play 1: $10 \times 1 = 10 \text{ pts}$
  * Play 2: $10 \times \frac{1}{\sqrt{2}} \approx 7.07 \text{ pts}$
  * Play 3: $10 \times \frac{1}{\sqrt{3}} \approx 5.77 \text{ pts}$
  * Diminishes down to a base floor of $10\%$ of original points.

---

## 3. Live Sessions & Multiplayer Flow (Kahoot-Style)

Licensed users (teachers/hosts) can spin up a `LiveSession` from any published `ModuleVersion`.

### 3.1 Session Lifecycle States
* **`STAGING` (Lobby):** 
  * Host configures rules and shares Code, QR Code, or direct Join Link.
  * Players join the staging room via nickname input (supporting guest anonymous logins or registered student accounts).
  * Groups/Teams can register and play as a single entity.
  * Host starts the session explicitly, transitioning it to `ACTIVE`.
* **`ACTIVE`:**
  * The lab starts. Players run the simulation on their devices.
  * Checkpoint scores and progression data are piped back in real-time to the host screen.
* **`COMPLETED`:**
  * The session finishes. Final scores are saved, and the leaderboard is locked.

### 3.2 Host Configuration Rules (Pre-play Setup)
Hosts configure the following rules on staging:
* `allowLateAdmissions`: Boolean (Enable/Disable players joining during active gameplay).
* `maxAdmissions`: Int (Set the maximum seats/players allowed in the room).
* `multipleAttempts`: Boolean (Allow/Disallow retrying checkpoint questions).
* `allowHints`: Boolean (Show/Hide hint UI during questions).
* `navigationMode`: String (`"free-roam"` allows buttons to go left/right, `"controlled"` forces lock-step chronological progression).
* `enabledCheckpoints`: String[] (List of `ModuleCheckpoint` IDs that are checked/active for this specific session, allowing teachers to hide certain questions).

```prisma
model LiveSession {
  id              String    @id @default(cuid())
  hostId          String    // Licensed host/teacher
  organizationId  String?   // Associated workspace/org
  moduleVersionId String    // The exact module version played
  joinCode        String    @unique // e.g. "X82F4"
  name            String?
  status          String    @default("STAGING") // "STAGING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  
  // Config block mapping: { allowLateAdmissions: true, maxAdmissions: 50, navigationMode: "controlled", ... }
  config          Json?     
  
  startedAt       DateTime?
  endedAt         DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  host               User                @relation("SessionHost", fields: [hostId], references: [id], onDelete: Cascade)
  organization       Organization?       @relation(fields: [organizationId], references: [id])
  moduleVersion      ModuleVersion       @relation(fields: [moduleVersionId], references: [id])
  players            SessionPlayer[]
  sessionCheckpoints SessionCheckpoint[]
  analytics          SessionAnalytic[]

  @@index([hostId])
  @@index([joinCode])
  @@index([status])
  @@map("live_session")
}
```

---

## 4. Leaderboard & Analytics

### 4.1 Leaderboard Page
The Live Session Leaderboard shows real-time performance of active players:
* **Top Podium:** A visually prominent display highlighting the **Top 3 players** (1st, 2nd, 3rd place).
* **Rankings Table:** Columns showing:
  * Rank (1st, 2nd, 3rd...)
  * Nickname / Group Name
  * Points Earned
  * Total Questions Attempted vs. Correct
* **Exports:** Actions to download the leaderboard as a formatted **PDF**.

### 4.2 Analytics Suite
The session dashboard generates three main visual analytics graphs:
1. **Subject Competence Graph (Overall Group):** Displays collective accuracy by subject/topic category (e.g. 80% correct on "Circuit Laws", 40% on "Electromagnetism") to identify class-wide gaps.
2. **Checkpoint Competence Graph (Item Analysis):** Displays item difficulty analysis (percentage of correct answers per specific question) helping teachers spot poorly understood checkpoints.
3. **Player Competence Graph (Individual Performance):** Shows a specific student's score over time, accuracy rate, and speed compared to class averages.

### 4.3 Session Overview & Root Page
The root page `/app/session/[id]` acts as the session command center, showing:
* Title & Description.
* Host Notes/Syllabus references.
* Live State indicators.
* Quick actions to export the full raw session metrics as CSV/JSON.

---

## 5. Pilot Implementation Strategy (React Three Fiber Hardcoding)

To deliver a high-quality pilot without building a complex real-time AI 3D scene compiler, we utilize a **React-driven fallback mapping**:

```
                              [Play Room]
                                   │
                                   ▼
                   [Does DB have config for slug?]
                                  / \
                                 /   \
                               YES    NO (Pilot Fallback)
                               /       \
         [Renders from dynamic JSON]   [Loads React Three Fiber component:
                                        moduleSlugToComponent[slug]]
```

### 5.1 The Slug-to-Component Registry
Instead of dynamically parsing an `interactiveConfig` JSON object, the frontend maps module slugs directly to hand-coded React components built using **React Three Fiber (R3F)** and **GSAP**:

```typescript
// src/components/labs/registry.tsx
import React from 'react';
import PendulumLab from './physics/pendulum';
import CircuitLab from './physics/circuits';

export const moduleSlugToComponent: Record<string, React.ComponentType<any>> = {
  "mechanics-pendulum": PendulumLab,
  "electromagnetism-circuits": CircuitLab,
};
```

### 5.2 Persistence Fallback (LocalStorage vs. DB)
* **Authenticated Users:** Progression, completed checkpoints, and XP are stored directly in the database (`ModuleProgress`, `SessionPlayer`, `SessionAnalytic`).
* **Anonymous / Guests:** State is persisted locally in the browser's `localStorage` (allowing guests to retain score context if they reload the page). If they sign up later, this state can be sync-flushed to the database.
