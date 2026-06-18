# Page Specification: Landing and Legal Pages

## 1. Requirements & Scope
- **Landing Page (`/`):**
  - High-impact visual introduction to OpenLearn's Ghanaian science lab simulations.
  - Curated overview of GES-verified modules.
  - Pricing component showing the three tiers (Solo Teacher, Department, Institutional/School).
  - Clear Call-to-Action (CTA) for students to "Play Anonymously" and teachers/admins to "Get Started / Buy License".
  - Section detailing open-source self-hosting (GitHub) and custom curriculum consulting.
- **Legal & Compliance Pages:**
  - **Terms of Service (`/legal/terms`):** Terms of use for the SaaS platform and DPG distribution model.
  - **Privacy Policy (`/legal/privacy`):** Detail on GDPR/Ghana Data Protection Act compliance. Mentioning no tracking for anonymous players until explicit consent.
  - **Cookie Policy (`/legal/cookies`):** Specific cookie utilization breakdown.
  - **Cookie Consent Banner:** Intercepts first-time users. Consent must be granted before loading analytical cookies (PostHog/Google Analytics).

---

## 2. UI & Design Guidelines
- **Aesthetics:** Sleek dark mode option, smooth gradients, premium typography (Outfit/Inter), glassmorphism styles on the pricing cards.
- **Header (Navigation Layout):**
  - *Left Section:* Application Logo (routing to home `/`).
  - *Middle Section:* Links to **Library** (routes to `/library`), **Modules** (routes to `/modules`), and **Licensing** (routes to `/billing`).
  - *Right Section:* **Play Session** CTA Action Button (routes to `/join` where students input join codes/QRs).
  - *Responsiveness:* Collapses to a hamburger toggle drawer on mobile and tablet viewports.
- **Footer:** Links to Legal pages, GitHub repo, school contact form, and copyright.
- **Cookie Banner:** Fixed footer banner with "Accept All", "Reject Non-Essential", and "Cookie Settings".

---

## 3. API & Data Layer
- **Client-Side Storage:** `localStorage` for storing user cookie consent choices.
- **Analytics Hook:** `adapters/analytics` exports a function `initAnalytics(consentGranted: boolean)` that initializes PostHog/Google Analytics only if consent is true.
- **Pricing Query:** Public route fetches available product pricing configurations if configured.

---

## 4. TDD / Test Cases (Playwright)
- **Cookie Consent Interception:**
  1. Visit `/` with fresh storage.
  2. Verify cookie banner is visible.
  3. Verify analytical scripts are NOT loaded/called.
  4. Click "Reject Non-Essential".
  5. Verify cookie banner disappears and analytical scripts remain disabled.
  6. Clear cookies, reload, click "Accept All".
  7. Verify analytics scripts initialize.
- **Responsive Layout:**
  1. Load `/` on mobile viewport (390px). Verify hamburger menu works.
  2. Load `/` on tablet viewport (768px) and desktop (1280px). Verify layouts adjust without overlapping elements.
- **Legal Navigation:**
  1. Click Footer legal links and verify they route to correct `/legal/*` static pages.

---

## 5. Page Content & Copy Deck

### Section 1: Hero Banner (Main Visual Intro)
- **Main Heading:** Interactive Science Labs for Every School in Ghana
- **Subheading:** Access free, curriculum-aligned 3D science simulations verified by the Ghana Education Service (GES). Play immediately in your browser—no login required.
- **Primary CTA Button:** Play Anonymously (routes to `/library` or `/modules` based on user selection)
- **Secondary CTA Button:** Host Live Session (routes to `/register` for teachers/admins)
- **Visual Asset:** High-quality background image or interactive 3D laboratory canvas mock showing test-tubes, beakers, and chemical interactions.

### Section 2: GES-Verified Curriculum Modules
- **Heading:** Curriculum-Aligned Virtual Labs
- **Intro Paragraph:** Built directly around the national Ghanaian science syllabus. Our virtual modules are vetted by the Ghana Education Service (GES) to ensure that students master core practical skills and abstract concepts safely and interactively.
- **Curriculum Feature Cards:**
  - *Chemistry (Form 1 - Form 4):* Acid-Base Titrations, Separation of Mixtures, Properties of Metals.
  - *Physics (Form 1 - Form 4):* Refraction of Light, Electrical Circuits, Heat Energy Transfer.
  - *Biology (Form 1 - Form 4):* Plant Cell Structures, Testing for Food Nutrients, Ecology Ecosystems.

### Section 3: Open-Source DPG Strategy
- **Heading:** A Global Digital Public Good (DPG)
- **Subheading:** Open-source software designed to democratize science education globally.
- **Copy Paragraph:** The OpenLearn codebase is completely open-source on GitHub. We believe high-quality educational tools should belong to the public. Schools, universities, and ministries can host their own private cloud instance of OpenLearn for free.
- **Consulting / Customization CTA:** 
  - *Callout:* Need your own deployment?
  - *Description:* We help institutions set up their own servers, upload custom school curricula, and connect local, offline AI models to automatically generate personalized labs for their pupils.
  - *Action Link:* Contact Setup & Integration Team.

### Section 4: Three-Tier Pricing (For Teachers & Schools)
- **Heading:** Pricing Tiers for Classrooms and Institutions
- **Subheading:** Empower your teaching staff with real-time analytics, session code distribution, and performance tracking.
- **Tier 1 Card: Solo Teacher**
  - *Price:* $4.99 / mo (Approx. 75 GHS)
  - *Best For:* Individual teachers purchasing out of pocket to assess their personal classrooms.
  - *Features:*
    - 1 Host/Teacher Seat
    - Up to 3 active concurrent sessions
    - Real-time student checkpoint tracking
    - Session-specific leaderboards
- **Tier 2 Card: Department Workspace**
  - *Price:* $19.99 / mo (Approx. 300 GHS)
  - *Best For:* Small subject teams (e.g., Chemistry Department) drawing directly from school department funds.
  - *Features:*
    - Up to 10 Host/Teacher Seats
    - Shared Organization Dashboard
    - Unlimited concurrent sessions
    - Shared session logs and histories
- **Tier 3 Card: Institutional / Enterprise**
  - *Price:* Custom Invoice (Contact Sales)
  - *Best For:* Private school chains, school buildings, or Ministry of Education integrations.
  - *Features:*
    - Unlimited Host/Teacher Seats
    - Wildcard email domain matching (e.g., `@achimotaschool.edu.gh` users automatically upgraded to Host status)
    - Custom logo branding on student view
    - Priority integration & setup support
- **Consulting Callout (Self-Hosted Upsell):**
  - *Title:* Private Server Customization
  - *Description:* Move off our hosted service. Contact us to configure your own local models and host the application on private school servers.

