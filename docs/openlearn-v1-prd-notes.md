# PRD Notes: OpenLearn V1

## Raw Requirements
- Problem: Lack of science labs in secondary schools in Ghana due to expensive equipment and materials; need to teach abstract concepts with interactive labs.
- Web app now; future desktop/mobile app.
- Users: teachers and students; not segregated in DB; onboarding asks role for analytics.
- Accounts required to play modules or create modules or play sessions; anonymous access allowed for sessions.
- Modules: environment with lab simulation and checkpoint questions (any number).
- Module creation: user uploads curriculum + docs (Ghana learning criteria); AI parses topics, subtopics, abstract concepts; user selects topic.
- AI generates lab simulation with appropriate controls in 2D canvas (implementation depth deferred).
- Module publishing: private or community; review + concept-safe approval badge.
- Sessions: teacher starts from module; students can play module directly.
- Sessions are kahoot-like: code/QR join; anonymous username or teacher-provided student ID; no student account required.
- Teacher can close admission and start session; students explore and answer checkpoints.
- Session results: leaderboard + student strengths based on assessment.
- Points/badges for actions (create/play/start session).
- Admin site: vet public modules; analytics (page views esp. play page, activation flows).
- Pages: landing, explore, sessions (played, awaiting), session detail (participants, leaderboard, settings/options), auth/legal.
- MVP constraint: no module editor; 4 predefined public modules; data structure matches future editor output.
- V1 batch 1 (pilot): auth/onboarding, marketing site, legal/privacy/cookie consent, admin basics, analytics, placeholder UI for app pages.
- V1 batch 2: core app features replace placeholders (sessions, module play, checkpoints, leaderboard flows).
- Later: module editor, session rules, renderer depth (2D/3D), full data models, scoring logic.

## Constraints
- Strict timeline for startup competition.
- Stack: Next.js, Better Auth, AWS EC2, AWS email, PostHog, Google tracking, Cookie JS permissions, S3 storage, AWS RDS.
- Performance target: optimized lab renderer (2D or 3D) to load fast on low network and run at good FPS on tablets; decision pending.

## Inferred Patterns (from codebase)

| Edge Case | Source | Pattern Applied |
|-----------|--------|-----------------|
| N/A | New Codebase | No existing patterns to infer. |

## Edge Cases

### Auto-handled (following codebase patterns)
- N/A

### Confirmed by User
- **Renderer Decision:** 3D with Three.js and R3F for V1. Data structures must be designed in a way that 2D can be incorporated later.
- **Session Rules:** Untimed. Scored by checkpoints completed successfully (no speed scoring). Session configuration determines if retakes are allowed and when the whole session ends.
- **Auth:** Sessions can be played by anonymous or registered users. Registered users earn points, badges, and streaks. Only registered users can play modules directly or start sessions.
- **Admin Approval:** Manual review by admin staff for the 'concept-safe' badge.

### Open Questions
- None. All questions resolved.

## Research Findings
(Add research on best practices, similar solutions)

## Architecture Options

- Option A: {Description}
  - Pros: {Advantages}
  - Cons: {Disadvantages}

- Option B: {Description}
  - Pros: {Advantages}
  - Cons: {Disadvantages}

- Option C: {Description}
  - Pros: {Advantages}
  - Cons: {Disadvantages}

**Selected**: Option {X}
