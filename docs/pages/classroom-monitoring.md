# Page Specification: Classroom Monitoring and Session Dashboard

## 1. Requirements & Scope
- **Session Host Dashboard (`/dashboard/sessions/[code]`):**
  - Real-time hub for teachers to monitor student participation and concept mastery during a live classroom session.
  - Displays unique **Join Code** and **QR Code** at the top.
  - **Participants List:** Shows students who have joined (display name or ID).
  - **Live Progress Grid:** Tracks what checkpoints each participant has completed and their correctness (e.g., Green/Red/Gray grid).
  - **Real-Time Leaderboard:** Ranks students based on correct responses.
  - **End Session Button:** Closes the session, locking submissions and saving the final leaderboard history.
- **Short-Polling System:**
  - Standard React Query hook configured to poll `/api/sessions/[code]/status` every 2-3 seconds.
  - Fetches participant counts, completion percentages, live scores, and checkpoint responses.
  - Decoupled from WebSockets, facilitating offline-friendly local deployments for schools.

---

## 2. UI & Design Guidelines
- **Aesthetics:** High-impact status boards, clean grid lines, progress bar animations indicating average classroom completion.
- **Grid Components:** Interactive table showing student names and checkpoint status. Hovering over a checkpoint shows the target question and selected choice.

---

## 3. API & Data Layer
- **Endpoints:**
  - `GET /api/sessions/[code]/status` — Aggregates checkpoint responses and returns live session stats (participating count, average completion rate, scores, leaderboard).
  - `POST /api/sessions/[code]/end` — Host-only action to set session status to `ended` and stamp the final `endedAt` time.
- **Participants Endpoint:**
  - `/api/sessions/[code]/submit` — Participant post route for checkpoint responses.

---

## 4. TDD / Test Cases (Playwright)
- **Live Short-Polling Validation:**
  1. Login as licensed host. Launch classroom session.
  2. Load host dashboard page. Verify polling timer triggers call every 2.5 seconds.
  3. Mock a student submitting a correct answer to Checkpoint 1 via `/api/sessions/[code]/submit`.
  4. Verify the next polling cycle response updates the host's grid showing Checkpoint 1 as Green (correct) for that student.
- **Average Progress Bar:**
  1. Start a mock session with 10 students.
  2. Mock 5 students completing 50% of the checkpoints.
  3. Verify the host dashboard progress bar animates to exactly 25% average completion.
- **End Session Lockout:**
  1. Click "End Session" on the host dashboard.
  2. Verify the session state database row switches `status` to `ended`.
  3. Attempt to submit a checkpoint response from a mock student client.
  4. Verify the student API returns a `400 Bad Request` stating the session has ended and rejects the answer.
  5. Check that the final leaderboard ranks are locked and displayed on the ended session archive.
