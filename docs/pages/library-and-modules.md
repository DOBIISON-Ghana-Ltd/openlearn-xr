# Page Specification: Library & Modules Catalog

## 1. Overview & Scope
- **Library (`/library` / `/collections`)**:
  - Displays sequential curriculum syllabi (e.g. Senior High School Chemistry / Physics / Biology).
  - Enforces linear progression: Module $N$ requires completion of Module $N-1$ in that collection.
  - Tracks completion via `CollectionProgress` and `ModuleCompletion` models.
- **Modules Catalog (`/modules`)**:
  - Searchable, filterable directory of all published science lab modules.
  - Allows free-roam play without prerequisite locks.
  - Filterable by subject, grade level, difficulty, and duration.

---

## 2. API Endpoints (5-Suite Taxonomy: `app`)
- `app:collection:get:all` (`GET /api/app/collections`) — Lists all curriculum collections with syllabus order.
- `app:collection:get:one` (`GET /api/app/collections/[id]`) — Fetches collection detail and user linear progress.
- `app:module:get:all` (`GET /api/app/modules`) — Search and filter catalog with pagination.
- `app:module:get:one` (`GET /api/app/modules/[id]`) — Fetches specific module metadata, notes, and published versions.
