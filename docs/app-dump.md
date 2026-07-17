# Collection & Media Refactor Specification

This document details the refactored schema and database plan for the **Collection** and **Media** relationship in OpenLearn XR. It shifts from a simple one-to-many direct relation to a flexible relation supporting categorized documents (Primary Docs for AI-parsing vs. Supplemental assets).

---

## 1. Objectives

* **Semantic Separation:** Distinguish between primary documents (e.g., textbook PDFs to be indexed/parsed by AI) and supplemental files (e.g., images, lab attachments, slides).
* **Many-to-Many Potential:** Allow files to optionally be associated with multiple collections.
* **Keep "Media" Model Name:** To avoid codebase-wide namespaces collisions and massive refactoring of S3/upload helpers, keep the model name as `Media` instead of renaming it to `File`.

---

## 2. Proposed Prisma Schema

### `Collection` Model
Stores the overall curriculum metadata and the AI-generated index containing extracted practicals.

```prisma
model Collection {
  id           String   @id @default(cuid())
  name         String   // e.g., "SHS Physics Book One"
  slug         String   @unique
  description  String?
  
  // AI-generated JSON: topics, subtopics, lab locations, page refs
  parsedIndex  Json?    
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  mediaFiles   CollectionMedia[]
  modules      Module[]

  @@map("collection")
}
```

### `CollectionMedia` (Join Table)
Connects `Collection` and `Media` models, adding a role flag to distinguish file purposes.

```prisma
model CollectionMedia {
  id           String              @id @default(cuid())
  collectionId String
  mediaId      String
  role         CollectionMediaRole @default(SUPPLEMENTAL)

  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  media        Media      @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([collectionId, mediaId])
  @@index([collectionId])
  @@index([mediaId])
  @@map("collection_media")
}

enum CollectionMediaRole {
  PRIMARY       // The main textbook/manual PDF used for AI practical extraction
  SUPPLEMENTAL  // Supporting resources, slides, images, etc.
}
```

### `Media` Model (Updated)
Standardized file tracking, storing keys pointing to S3.

```prisma
model Media {
  id           String   @id @default(cuid())
  uploaderId   String
  folder       String   // e.g., "avatar", "documents"
  status       String   @default("active") // "active" | "deleted" | "uploading" | "processing" | "ready" | "failed"
  key          String   @unique // Path/key in the configured storage adapter
  fileName     String   // original file name
  mimeType     String
  metadata     Json?    // Optional JSON for variable metadata (e.g. { sizeBytes, width, height })
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  uploader     User              @relation("Uploader", fields: [uploaderId], references: [id], onDelete: Cascade)
  collections  CollectionMedia[]

  @@index([uploaderId])
  @@index([status])
  @@map("media")
}
```

---

## 3. Module Refactor Specification

The `Module` model stores individual educational scenarios/labs mapped to a `Collection` without the need for individual thumbnails, utilizing a linear `orderIndex` and managing draft/published versions.

### `Module` Model (Updated)
```prisma
model Module {
  id                 String   @id @default(cuid())
  collectionId       String   // Which collection/book this module is drawn from
  title              String
  slug               String   @unique
  description        String
  orderIndex         Int      // Controls "Book Mode" linear unlock ordering
  publishedVersionId String?  @unique // FK to the currently live ModuleVersion
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  collection         Collection       @relation(fields: [collectionId], references: [id])
  versions           ModuleVersion[]  @relation("ModuleVersions")
  publishedVersion   ModuleVersion?   @relation("PublishedVersion", fields: [publishedVersionId], references: [id], onDelete: SetNull)
  progress           ModuleProgress[]

  @@index([collectionId])
  @@map("module")
}
```

---

## 4. Implementation Plan & Steps

### Step 1: Schema Updates
* Replace the `Collection` and `Media` model definitions in [schema.prisma](file:///d:/delmac/dobiison/projects/open-learn-xr/prisma/schema.prisma) with the new `Collection`, `CollectionMedia`, `CollectionMediaRole`, and `Media` definitions.
* Remove the `thumbnail` property from the `Module` model in [schema.prisma](file:///d:/delmac/dobiison/projects/open-learn-xr/prisma/schema.prisma).
* Verify that the back-relations in `ModuleVersion` (`module` and `publishedFor`) match the modified relations in `Module`.

### Step 2: Database Migration
* Generate a database migration:
  ```bash
  npx prisma migrate dev --name refactor_collection_and_module_schema
  ```
  *(Note: If you have existing data, write a temporary SQL step inside the migration folder to copy `collectionId` from `media` table into `collection_media` table before dropping the column.)*

### Step 3: API & Frontend Updates
* Update corresponding Zod validations (e.g., in `org.schema.ts`, `module.schema.ts`, or any endpoints) to remove `thumbnail` constraints and reflect the new structure.
* Wire up file uploading to write to the `CollectionMedia` join table when uploading files specifically for a collection.
* Remove any reference to `module.thumbnail` from UI components.
