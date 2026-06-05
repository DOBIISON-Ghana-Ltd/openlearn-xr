# PRD: OpenLearn V1

> Status: COMPLETE
> Last updated: 2026-06-03

## Table of Contents
- [Problem Statement](#problem-statement)
- [Goals and Non-Goals](#goals-and-non-goals)
- [Success Criteria](#success-criteria)
- [Scope](#scope)
- [Requirements](#requirements)
- [User Flows](#user-flows)
- [Implementation Plan](#implementation-plan)

---

## Problem Statement
Secondary schools in Ghana often lack science labs due to equipment and material costs, which makes it hard to teach and learn abstract science concepts. OpenLearn provides interactive lab simulations and checkpoints so teachers can assess understanding without physical lab infrastructure.

## Goals and Non-Goals
### Goals
- Provide interactive science modules that improve student confidence and understanding of abstract topics.
- Enable teachers to run classroom sessions and assess learner strengths via checkpoints and leaderboards.
- Offer a fast, intuitive V1 experience on tablets and low-network environments.
- Deliver a usable web MVP with onboarding, legal compliance, admin basics, and placeholder app UI.

### Non-Goals
- No module editor in V1 (use predefined modules only).
- No desktop/mobile apps in V1.
- No requirement to segregate user roles in the database for V1.

## Success Criteria
- Students report confidence using OpenLearn modules in feedback surveys.
- Tutors find the modules valuable for curriculum-aligned instruction.
- Modules effectively assess understanding of abstract concepts (teacher feedback + checkpoint performance signal).
- V1 is rated easy and intuitive to use by teachers and students.
- Acceptable performance on tablets under low network conditions.

## Scope
### In Scope
- Web MVP with auth, onboarding, and account-based access to modules and sessions.
- Anonymous session join via code/QR with username or teacher-provided student ID.
- Four predefined public modules with lab environment and checkpoints.
- Explore page, sessions list (played/awaiting), session detail (participants, leaderboard, settings).
- Landing/marketing site with content and brand styling.
- Legal pages: privacy, terms, cookie consent.
- Admin site for module approval, analytics (page views, activation funnels), and user view.
- Points, badges, and streaks for core actions.

### Out of Scope
- Module editor and AI curriculum parsing UI.
- Community module submissions beyond predefined modules.
- Native desktop/mobile builds.

## Requirements
### Functional Requirements
- Users must create accounts to play modules or create/play sessions.
- Sessions must allow anonymous join with a session code or QR and a display name or student ID.
- Registered users can start sessions from a module and configure settings (retakes allowed, session end).
- Registered users can play modules directly (outside sessions).
- Sessions must collect checkpoint responses and produce a leaderboard based on successful completions (untimed).
- Modules must be rendered in 3D using Three.js/React Three Fiber, with a data structure that supports future 2D fallback.
- Admins must approve public modules and manage concept-safe badges.
- Analytics must track page views, module selection, module play, session play, and session completion.

### Non-Functional Requirements
- Must load and run smoothly on tablet devices with low network conditions.
- Comply with privacy and cookie consent requirements.
- Instrumentation must respect consent before tracking cookies.
- Data architecture must support the current 3D R3F renderer and be adaptable for a future 2D fallback renderer.

## User Flows
- Teacher creates account, explores modules, starts session, shares code/QR, starts session, reviews leaderboard.
- Student joins session anonymously, explores lab, answers checkpoints, sees results.
- Authenticated user plays a module directly, earns points/badges.

## Implementation Plan
- Batch 1 (Pilot): User management and auth, onboarding, landing/legal pages, admin basics, analytics instrumentation, placeholder app UI.
- Batch 2: Core app features replace placeholders, including sessions, module play, checkpoints, and leaderboard flows.
