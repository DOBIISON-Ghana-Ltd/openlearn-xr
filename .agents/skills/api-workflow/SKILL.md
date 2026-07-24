---
name: api-workflow
description: Super skill that enforces the strict Open Learn XR API architecture, routing workflow, 5-suite taxonomy (app, sim, ses, editor, admin), and data fetching rules. Make sure to use this skill whenever creating a new API endpoint, fetching data, mutating data, adding a new route, or creating a Zod schema. Always consult this skill to perfectly match the project's custom TanStack React Query + Zod + Next.js Server Route architecture!
---

# API Workflow & Architecture

This repository uses a highly structured, custom architecture for fetching and mutating data across 5 dedicated suite domains: `app`, `sim`, `ses`, `editor`, and `admin`. It enforces end-to-end type safety using Zod, customized React Query configurations, and centralized key/route registries.

**CRITICAL RULE:** Do NOT hallucinate standard Next.js `fetch` calls or basic React Query setups. You MUST follow the exact workflow below for every single API endpoint you touch or create.

---

## 1. The 5 Suite Scopes & 4-Part Key Format
Every API route, cache key, and configuration object is mapped to a strict 4-part, colon-separated string:

`[Suite]:[Entity]:[Method]:[Action]`

### The 5 Suite Scopes
1. **`app`**: Core application APIs (user profiles, authentication, organizations, subscription licensing, onboarding).
2. **`sim`**: Simulation suite APIs (learner modules, play attempts, checkpoints, interactive simulation state).
3. **`ses`**: Session suite APIs (live classroom sessions, room tokens, real-time sessions).
4. **`editor`**: Editor suite APIs (collections, draft modules, module versions, lab timelines, media/documents).
5. **`admin`**: Admin suite APIs (system subscriptions, email logs, audit controls).

### Action Taxonomy
* **`all`**: Fetch a list of entities (e.g., `sim:module:get:all`)
* **`one` / `id`**: Fetch a single entity by identifier (e.g., `editor:collection:get:id`)
* **`options`** / **`select`**: Fetch lightweight minimal projection (`id` + `label/title`) to populate dropdown selects, comboboxes, or picker UIs (e.g., `editor:module-version:get:options`)
* **`create`**: Create a new entity (e.g., `editor:collection:post:create`)
* **`update`**: Patch/update an entity (e.g., `admin:user:patch:role`)
* **`delete`**: Remove an entity (e.g., `app:user:delete:me`)

---

## 2. Strict Naming Conventions

### A. Zod Schema Variable Names (`src/data/api/[suite]/[suite].schema.ts`)
Must start with **PascalCase** suite name, following `[SuitePascal][EntityPascal][MethodPascal][ActionPascal]`:

- `AppUserGetMe`
- `SimModuleGetAll`
- `EditorModuleVersionGetOptions`
- `EditorCollectionGetAll`
- `SesSessionGetAll`
- `AdminUserGetAll`

### B. Query / Mutation Config Variable Names (`src/data/api/[suite]/[suite].api.ts`)
Must start with **camelCase** suite name, following `[suiteCamel][EntityPascal][MethodPascal][ActionPascal]`:

- `appUserGetMe`
- `simModuleGetAll`
- `editorModuleVersionGetOptions`
- `editorCollectionGetAll`
- `sesSessionGetAll`
- `adminUserGetAll`

> [!CAUTION]
> **STRICTLY FORBIDDEN PATTERN**: `appGetAllUser` or `simGetAllModule`.
> Placing `Method:Action` before `Entity` is strictly forbidden. The sequence must ALWAYS be `Suite` -> `Entity` -> `Method` -> `Action`.

---

## 3. Directory Layout Rules

All API definitions are strictly grouped under their respective suite directory:

```
src/
├── data/
│   └── api/
│       ├── app/
│       │   ├── app.schema.ts
│       │   └── app.api.ts
│       ├── sim/
│       │   ├── sim.schema.ts
│       │   └── sim.api.ts
│       ├── ses/
│       │   ├── ses.schema.ts
│       │   └── ses.api.ts
│       ├── editor/
│       │   ├── editor.schema.ts
│       │   └── editor.api.ts
│       └── admin/
│           ├── admin.schema.ts
│           └── admin.api.ts
└── app/
    └── api/
        ├── app/
        ├── sim/
        ├── ses/
        ├── editor/
        └── admin/
```

---

## 4. The 11 Categories of Data Flow
Before implementing an API, identify which category it falls into:

### Category A: Protected API Routes (Requires User Session)
*Use the `secureApiRoute` wrapper in Next.js Server Routes.*
1. **Fetch of many**: `[suite]:[entity]:get:all`
2. **Fetch of one**: `[suite]:[entity]:get:id`
3. **POST or PATCH**: `[suite]:[entity]:post:create` or `[suite]:[entity]:patch:update`
4. **DELETE**: `[suite]:[entity]:delete`

### Category B: Unprotected API Routes (Publicly Accessible)
*Use the `apiHandler` wrapper in Next.js Server Routes.*
5. **Fetch of many**: `[suite]:[entity]:get:all`
6. **Fetch of one**: `[suite]:[entity]:get:id`
7. **POST or PATCH**: `[suite]:[entity]:post:create` or `[suite]:[entity]:patch:update`
8. **DELETE**: `[suite]:[entity]:delete`

### Category C: Better Auth Native Routes (No Custom API Route Needed)
*Use Better Auth's `authClient` directly inside `mutationFn`. Do NOT create custom Next.js API routes for these.*
9. **Fetch**: e.g., `authClient.session.get()`
10. **POST or PATCH**: e.g., `authClient.organization.create()`, `authClient.user.update()`
11. **DELETE**: e.g., `authClient.session.revoke()`

---

## 5. The 7-Step Implementation Workflow (Queries)
To create a new custom API Query endpoint (Categories A and B), execute these exact steps:

### Step 1: Define the Zod Schema (`src/data/api/[suite]/[suite].schema.ts`)
Create a strict contract using the custom `ZApi` wrapper.

> [!IMPORTANT]
> **90% of the time**, your schema should be derived directly from the central database models exported in `src/data/schema.base.ts`. Use `.pick()` to select the required fields and `.extend()` to add nested relations or computed properties. Do NOT hallucinate raw `z.object({})` schemas unless absolutely necessary.

```typescript
import { ZApi, ZModule } from "@/data/schema.base";
import { z } from "zod";

const SimModuleGetAll = ZApi({
  res: z.array(
    ZModule.pick({
      id: true,
      title: true,
      description: true,
    }).extend({
      // Add nested relations (like Prisma includes) or computed properties here
    })
  )
});

export default {
  SimModuleGetAll,
};
```

### Step 2: Register Cache Key Tuple (`src/data/key-factory.ts`)
```typescript
"sim:module:get:all": ["sim", "modules", "all"] as const,
```

### Step 3: Register Route Path (`src/data/route-factory.ts`)
```typescript
"sim:module:get:all": () => '/api/sim/modules',
```

### Step 4: React Query Configuration (`src/data/api/[suite]/[suite].api.ts`)
Define the React Query fetcher object using `QueryConfig` (NO explicit generics!). Use the spread operator `...` to correctly clone the immutable cache key tuple.

```typescript
import { QueryConfig } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import ZSim from "./sim.schema";

const simModuleGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["sim:module:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["sim:module:get:all"]()),
      ZSim.SimModuleGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

export default {
  "sim:module:get:all": simModuleGetAll,
};
```

### Step 5: Hook into Global Registry (`src/data/registry.ts`)
Import the `[suite].api.ts` file and spread it into the `apiRegistry` object so it populates into the `ApiRegistry` type.

### Step 6: Build the Server Route (`src/app/api/[suite]/.../route.ts`)
Write the actual backend handler. 
* **If Category A (Protected)**: Wrap with `secureApiRoute(async (req, ctx, user, session) => {})`.
* **If Category B (Unprotected)**: Wrap with `apiHandler(async (req) => {})`.

```typescript
// Category A (Protected Example)
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";

export const GET = secureApiRoute(async (req, ctx, user) => {
  const modules = await prisma.module.findMany();
  const parsedData = ZSim.SimModuleGetAll.shape.res.parse(modules);
  return JSend.success(parsedData);
});

// Category B (Unprotected Example)
import { apiHandler } from '@/lib/utils/api-handler';

export const GET_PUBLIC = apiHandler(async (req) => {
  const modules = await prisma.module.findMany();
  const parsedData = ZSim.SimModuleGetAll.shape.res.parse(modules);
  return JSend.success(parsedData);
});
```

### Step 7: Fetch in the UI!
Use the custom `useApi` hook perfectly wired into the registry.
```tsx
import useApi from "@/data/hooks/use-api";

export default function ModulesList() {
  const { data: modules, isLoading } = useApi.query("sim:module:get:all");
}
```

---

## 6. The 6-Step Implementation Workflow (Mutations & Form Integration)
To create a Mutation (POST/PATCH), you must tightly couple the `ZApi` schema to the frontend form.

### Step 1: Define the Zod Schema (`[suite].schema.ts`)
For mutations, define both the incoming payload (`body`) and outgoing result (`res`) via `ZApi`. Remember to use `.pick()` and `.extend()` from the central schema base!

```typescript
import { ZApi, ZCollection } from "@/data/schema.base";

const EditorCollectionCreate = ZApi({
  body: ZCollection.pick({
    name: true,
    description: true,
  }).extend({
    // Add extra frontend-only fields here if needed
  }),
  res: ZCollection.pick({
    id: true,
  }),
});
```

### Step 2: Register the Route Path (`route-factory.ts`)
```typescript
"editor:collection:post:create": () => '/api/editor/collections',
```

### Step 3: Create the Mutation Config (`[suite].api.ts`)
Define the mutation using `Infer` and `satisfies MutationConfig`.

> [!IMPORTANT]
> **Better Auth Client Mutations (Category C)**:
> When wrapping a Better Auth client SDK mutation directly, DO NOT use `fetcher` or `axios`, and DO NOT create a backend `route.ts` or add to `route-factory.ts`. Instead, call `authClient` directly inside `mutationFn`, throw an `ApiError` if the response has an error, and map the schema fields (such as picking `id` from `ZOrganization`) directly to Better Auth API parameters.
> 
> *Example (Setting Active Organization)*:
> ```typescript
> // 1. In app.schema.ts:
> const AppOrgSetActive = ZApi({
>   body: ZOrganization.pick({ id: true })
> });
> 
> // 2. In app.api.ts:
> const appOrgSetActive = {
>   type: "mutation",
>   mutationFn: async (body: Infer["AppOrgSetActive"]["body"]) => {
>     const res = await authClient.organization.setActive({
>       organizationId: body.id
>     });
>     if (res.error) {
>       throw new ApiError(res.error.message || "Failed to set active organization", 400);
>     }
>     return "Organization set as active successfully";
>   },
> } satisfies MutationConfig;
> 
> // 3. In the UI Component (my-organizations.tsx):
> const { mutate: setActive } = useApi.mutate("app:org:patch:active");
> setActive({ id: orgId }, { onSuccess: () => { ... } });
> ```

```typescript
import { Infer, MutationConfig } from "@/data/types.base";

const editorCollectionCreate = {
  type: "mutation",
  mutationFn: async (body: Infer["EditorCollectionCreate"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["editor:collection:post:create"](), body),
      ZEditor.EditorCollectionCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;
```

### Step 4: Hook into the Global Registry (`registry.ts`)
Spread the module inside the `apiRegistry` object.

### Step 5: Build the Server Route (`route.ts`)
> [!WARNING]
> Skip this step completely if you are using a native Better Auth client mutation! No `route.ts` should be created!

Wrap in `secureApiRoute` or `apiHandler`, validate the body, and return `JSend.success`.
```typescript
export const POST = secureApiRoute(async (req, ctx, user, session) => {
  const rawBody = await req.json();
  const body = ZEditor.EditorCollectionCreate.shape.body.parse(rawBody);
  
  // Database operation...
  
  const parsedData = ZEditor.EditorCollectionCreate.shape.res.parse(result);
  return JSend.success(parsedData);
});
```

### Step 6: Client Form Consumption (The ZForm/IForm Pattern)
Strictly type frontend forms by abstracting the schema payload using the global `Infer` helper. Do not pass explicit generics directly to `useForm`.

```tsx
import { Infer } from "@/data/types.base";
import ZEditor from "@/data/api/editor/editor.schema";

const ZForm = ZEditor.EditorCollectionCreate.shape.body;
type IForm = Infer["EditorCollectionCreate"]["body"];

const defaultValues: IForm = {
  name: "",
  description: ""
};

export function CreateCollectionForm() {
  const form = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues
  });
  
  const onSubmit = (data: IForm) => { 
    // Reset or handle submit
  }
}
```

---

## 7. The 5-Step Implementation Workflow (Deletes)

### Step 1: Define the Zod Schema (`[suite].schema.ts`)
```typescript
const AppUserDeleteMe = ZApi({
  body: z.object({
    confirmText: z.string()
  }),
});
```

### Step 2: Register Route Path (`route-factory.ts`)
```typescript
"app:user:delete:me": () => '/api/app/users/me',
```

### Step 3: Create Mutation Config (`[suite].api.ts`)
```typescript
const appUserDeleteMe = {
  type: "mutation",
  mutationFn: async (body: Infer["AppUserDeleteMe"]["body"]) => {
    const data = await fetcher(
      () => axios.delete(R["app:user:delete:me"](), { data: body }),
      ZApp.AppUserDeleteMe.shape.res
    );
    return data;
  },
} satisfies MutationConfig;
```

### Step 4: Hook into Global Registry (`registry.ts`)

### Step 5: Build Server Route (`route.ts`)
```typescript
export const DELETE = secureApiRoute(async (req, ctx, user, session) => {
  const rawBody = await req.json();
  const body = ZApp.AppUserDeleteMe.shape.body.parse(rawBody);
  
  // DB deletion logic...
  
  return JSend.success("User account deleted successfully.");
});
```
