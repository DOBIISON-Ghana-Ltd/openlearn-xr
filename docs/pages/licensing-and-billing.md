# Page Specification: Licensing and Billing

## 1. Requirements & Scope
- **License Purchasing Page (`/billing`):**
  - Displays three available subscription tiers:
    1. **Solo Teacher:** Individual host subscription. Allows 1 user seat, max 3 concurrent active classroom sessions.
    2. **Department Pack:** Pack of 5 to 10 user seats. Shared organization access.
    3. **Institutional License:** School-wide unlimited teacher access. Domain wildcard configuration.
  - Links to Stripe checkout for `openlearn.org` deployment.
  - Decoupled from checkout flows for self-hosted instances (config toggles mock-purchases or grants admin licenses).
- **Seat Management View (Inside Organization Settings):**
  - Visible only to Organization owners of active **Department** or **Institutional** licenses.
  - Allows inviting other teachers by email.
  - Displays remaining seats out of the purchased limit.
  - Institutional view shows the active wildcard domain parameter (e.g., `@achimotaschool.edu.gh`). Any teacher signing up with that domain is auto-added as a licensed host member in that school's organization workspace.

---

## 2. UI & Design Guidelines
- **Visuals:** Grid structure displaying tier cards. The active tier card has a highlighted glowing border.
- **Form Controls:** Clean input fields for domain parameters, copyable email invitation links, and lists showing active seats with a "Revoke Member" button.

---

## 3. API & Data Layer
- **Endpoints:**
  - `POST /api/billing/checkout` — Generates a Stripe checkout URL.
  - `POST /api/billing/webhook` — Receives Stripe events to activate/renew/revoke database `License` records.
  - `POST /api/organization/invite` — Invites a user to the organization.
  - `POST /api/organization/wildcard` — Sets the email domain wildcard.
- **Better Auth Integration:**
  - Relies on the `organization` plugin's member invitation and membership status.

---

## 4. TDD / Test Cases (Playwright)
- **Solo License Constraints:**
  1. Login as a Solo Teacher.
  2. Purchase a Solo License. Verify `License` model is active with `seatsLimit = 1` and `maxConcurrentSessions = 3`.
  3. Spin up 3 active concurrent classroom sessions.
  4. Attempt to create a 4th session. Verify API returns a `403 Forbidden` response limiting active sessions.
- **Department Seat Limitations:**
  1. Purchase a Department license with 5 seats.
  2. Invite 4 teachers. Verify they can join.
  3. Attempt to invite a 6th teacher. Verify system blocks invitation with a "Seat Limit Exceeded" warning.
- **Wildcard Domain Auto-Onboarding:**
  1. Admin sets wildcard domain to `@achimotaschool.edu.gh`.
  2. Sign up a new user with email `teacher1@achimotaschool.edu.gh`.
  3. Verify the signup workflow intercepts, matches the domain, adds the user to the organization, and instantly grants session-creation capabilities without manual invitations.

---

## 5. Page Content & Copy Deck

### Section 1: Subscription Selection
- **Main Heading:** Select Your Classroom Plan
- **Body Text:** Unlock advanced tracking, custom join links, and live classroom analytics. Select the plan that fits your teaching scale.
- **Billing Period Toggle:** [ Monthly Billing ] / [ Annual Billing (Save 20%) ]

### Section 2: Solo checkout Highlights
- **Title:** Solo License Checkout
- **Bullet Highlights:**
  - Fast billing integration via Stripe.
  - Grants instant session hosting access.
  - Active session limit: 3 concurrent classrooms.
  - Session reports saved indefinitely.

### Section 3: Organization Invite Form (Department/School dashboard)
- **Invite Panel Title:** Invite Collaborators
- **Input Placeholder:** e.g., teacher@school.edu.gh
- **Seat Status indicator text:** "Using {activeSeats} of {maxSeats} seats. Need more seats? [Upgrade Plan]"
- **Invitation Alert Info:** "Invited teachers will receive an activation email linked to your organization workspace. They will automatically inherit session-creation permissions."

### Section 4: Wildcard Domain Input Panel (Institutional only)
- **Wildcard Domain Form Title:** Manage School Domain Access
- **Instructions:** "Enter your school's email suffix domain below. Any registered user signing up with a matching domain will automatically bypass invitations and join this school workspace with licensed teacher privileges."
- **Input Field Placeholder:** e.g., @achimotaschool.edu.gh
- **Warning Notice:** "Warning: Changing this parameter immediately revokes wildcard access for any new signups under old domains. Active members will not be affected."

