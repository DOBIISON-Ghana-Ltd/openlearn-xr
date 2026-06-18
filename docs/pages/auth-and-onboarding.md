# Page Specification: Auth and Onboarding

## 1. Requirements & Scope
- **Sign Up (`/register`):**
  - Registration fields: Name, Email, Password.
  - Requires email verification via OTP (One-Time Password) before account activation.
  - On signup, a default personal **Organization** is automatically created via the Better Auth organization plugin, serving as the workspace for a 1-seat Solo License.
- **Login (`/login`):**
  - Fields: Email, Password.
  - Support for Google OAuth single sign-on.
  - Redirects to onboarding if incomplete, else to dashboard.
- **Email OTP Verification (`/verify`):**
  - Renders input for the verification code sent to the email.
- **Onboarding Flow (`/onboarding`):**
  - 3-step setup flow:
    1. *Profile setup:* Select avatar icon, configure display name.
    2. *Role selection:* Select primary identity (Teacher/Admin vs Student/Learner).
    3. *Organization/School details:* Configure the personal organization name or link with a school license.
  - Server-side completion writes `onboarded: true` to the User metadata.

---

## 2. UI & Design Guidelines
- **Visuals:** Centered auth cards with glassmorphic backgrounds. Micro-animations on inputs (scale-up on focus, wiggle on validation error).
- **Steppers:** A clean horizontal progress tracker at the top of the onboarding interface to show current steps (1 -> 2 -> 3).

---

## 3. API & Data Layer
- **Better Auth Client Hooks:**
  - `signUp.email()` and `signIn.email()` mapping to the Better Auth backend.
  - `organization.create()` called internally upon successful sign-up to provision the personal organization workspace.
- **Onboarding State:**
  - Client state managed in `store/onboarding`.
  - Mutation updates user database fields `onboarded` and `name` / `avatarId`.

---

## 4. TDD / Test Cases (Playwright)
- **Sign Up and Auto-Org Creation:**
  1. Complete `/register` form.
  2. Verify verification code is requested and mock email OTP service triggers.
  3. Enter valid OTP. Verify redirection to `/onboarding`.
  4. Query database to ensure User is verified and that an `Organization` has been created with this User as owner/member.
- **Onboarding Interception Guard:**
  1. Login with a verified but non-onboarded user.
  2. Attempt to navigate directly to `/dashboard`.
  3. Verify that the custom cookie-cache route proxy (`proxy.ts`) intercepts the call and redirects back to `/onboarding`.
- **Onboarding Stepper Completeness:**
  1. Complete onboarding Step 1, verify Step 2 unlocks.
  2. Complete Step 3. Click submit.
  3. Verify db `onboarded` flag is `true`.
  4. Verify subsequent dashboard navigations are allowed.
