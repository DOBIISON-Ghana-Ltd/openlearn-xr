---
name: api-workflow
description: Super skill that enforces the strict Open Learn XR API architecture, routing workflow, and 11-category data fetching rules. Make sure to use this skill whenever the user wants to create a new API endpoint, fetch data, mutate data, add a new route, or create a Zod schema. Always consult this skill to perfectly match the project's custom TanStack React Query + Zod + Next.js Server Route architecture!
---

# API Workflow & Architecture

This repository uses a highly structured, custom architecture for fetching and mutating data. It enforces end-to-end type safety using Zod, customized React Query configurations, and centralized registries. 

**CRITICAL RULE:** Do NOT hallucinate standard Next.js `fetch` calls or basic React Query setups. You MUST follow the exact workflow below for every single API endpoint you touch or create.

---

## 1. Naming Convention: The 4-Part Key
Every API route, cache key, and configuration object is mapped to a strict, colon-separated string:
`[Visibility]:[Entity]:[Method]:[Action]`

* **Visibility**: `public` (unprotected and authenticated user), `admin` (privileged)
* **Entity**: `user`, `org`, `module`, `media`, etc.
* **Method**: `get`, `post`, `patch`, `delete`
* **Action**: `all` (fetch many), `me` (fetch current), `id` (fetch one by ID), `create`, `update`, etc.

*Example*: `"public:module:get:all"`, `"admin:module:post:create"`

---

## 2. The 11 Categories of Data Flow
Before implementing an API, identify which of the 11 categories it falls into:

### Category A: Protected API Routes (Requires User Session)
*Use the `secureApiRoute` wrapper in Next.js Server Routes.*
1. **Fetch of many**: `public:[entity]:get:all`
2. **Fetch of one**: `public:[entity]:get:id`
3. **POST or PATCH**: `public:[entity]:post:create` or `protected:[entity]:patch:update`
4. **DELETE**: `public:[entity]:delete`

### Category B: Unprotected API Routes (Publicly Accessible)
*Use the `apiHandler` wrapper in Next.js Server Routes.*
5. **Fetch of many**: `public:[entity]:get:all`
6. **Fetch of one**: `public:[entity]:get:id`
7. **POST or PATCH**: `public:[entity]:post:create` or `public:[entity]:patch:update`
8. **DELETE**: `public:[entity]:delete`

### Category C: Better Auth Native Routes (No Custom API Route Needed)
*Use Better Auth's `authClient` directly on the frontend. Do NOT create custom Next.js API routes for these.*
9. **Fetch**: e.g., `authClient.session.get()`
10. **POST or PATCH**: e.g., `authClient.organization.create()`, `authClient.user.update()`
11. **DELETE**: e.g., `authClient.session.revoke()`

---

## 3. The 7-Step Implementation Workflow (Queries)
To create a new custom API Query endpoint (Categories A and B), execute these exact steps:

### Step 1: Define the Zod Schema (`src/data/api/[entity]/[entity].schema.ts`)
Create a strict contract using the custom `ZApi` wrapper.

> [!IMPORTANT]
> **90% of the time**, your schema should be derived directly from the central database models exported in `src/data/schema.base.ts`. Use `.pick()` to select the required fields and `.extend()` to add nested relations or computed properties. Do NOT hallucinate raw `z.object({})` schemas unless absolutely necessary.

```typescript
import { ZApi, ZModule } from "@/data/schema.base";

const PublicModuleGetAll = ZApi({
  res: z.array(
    ZModule.pick({
      id: true,
      title: true,
    }).extend({
      // Add nested relations (like Prisma includes) or computed properties here
    })
  )
});

export default {
  PublicModuleGetAll
};
```

### Step 2: Register Cache Keys (`src/data/key-factory.ts`)
Add the exact cache key tuple.
```typescript
"public:module:get:all": ["public", "modules", "all"] as const,
```

### Step 3: Register the Route Path (`src/data/route-factory.ts`)
Map the key to the relative URL string.
```typescript
"public:module:get:all": () => '/api/modules',
```

### Step 4: React Query Configuration (`src/data/api/[entity]/[entity].api.ts`)
Define the React Query fetcher object using `QueryConfig` (NO explicit generics!). Use the spread operator `...` to correctly clone the immutable cache key tuple.
```typescript
import { QueryConfig } from '@/data/types.base';
import { QUERY_KEYS } from '@/data/key-factory';
import R from '@/data/route-factory';

const publicGetAllModules = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:module:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["public:module:get:all"]()),
      ZModule.PublicModuleGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

export default {
  "public:module:get:all": publicGetAllModules,
};
```

### Step 5: Hook into Global Registry (`src/data/registry.ts`)
Import the new `[entity].api.ts` file and spread it into the `apiRegistry` object so it populates into the `ApiRegistry` type.

### Step 6: Build the Server Route (`src/app/api/[entity]/route.ts`)
Write the actual backend handler. 
* **If Category A (Protected)**: Wrap with `secureApiRoute(async (req, ctx, user, session) => {})`.
* **If Category B (Unprotected)**: Wrap with `apiHandler(async (req) => {})`.

```typescript
// Unprotected Example
import { apiHandler } from '@/lib/utils/api-handler'
import { JSend } from '@/lib/utils/jsend'

export const GET = apiHandler(async (req) => {
  const modules = await prisma.module.findMany();
  const parsedData = ZModule.PublicModuleGetAll.shape.res.parse(modules);
  return JSend.success(parsedData);
});
```

### Step 7: Fetch in the UI!
Use the custom `useApi` hook perfectly wired into the registry.
```typescript
import useApi from '@/data/hooks/use-api';

// In a React Component:
const { data: modules } = useApi.query("public:module:get:all");
```

---

## 4. The 6-Step Implementation Workflow (Mutations & Form Integration)
To create a Mutation (POST/PATCH), you must tightly couple the `ZApi` schema to the frontend form.

### Step 1: Define the Zod Schema (`[entity].schema.ts`)
For mutations, define both the incoming payload (`body`) and outgoing result (`res`) via `ZApi`. Remember to use `.pick()` and `.extend()` from the central schema base!

```typescript
import { ZApi, ZModule } from "@/data/schema.base";

const AdminModuleCreate = ZApi({
  body: ZModule.pick({
    title: true,
    description: true,
  }).extend({
    // Add extra frontend-only fields here if needed
  }),
  res: ZModule.pick({
    id: true,
    title: true
  })
});
```

### Step 2: Register the Route Path (`route-factory.ts`)
Map the key to the relative API path.
```typescript
"admin:module:post:create": () => '/api/modules',
```

### Step 3: Create the Mutation Config (`[entity].api.ts`)
Define the mutation using `Infer` and `satisfies MutationConfig`.

> [!IMPORTANT]
> **Better Auth Client Mutations (Category C)**:
> When wrapping a Better Auth client SDK mutation directly, DO NOT use `fetcher` or `axios`, and DO NOT create a backend `route.ts` or add to `route-factory.ts`. Instead, call `authClient` directly inside `mutationFn`, throw an `ApiError` if the response has an error, and map the schema fields (such as picking `id` from `ZOrganization`) directly to Better Auth API parameters.
> 
> *Example (Setting Active Organization)*:
> ```typescript
> // 1. In org.schema.ts:
> const PublicOrgSetActive = ZApi({
>   body: ZOrganization.pick({ id: true })
> });
> 
> // 2. In org.api.ts:
> const publicSetActive = {
>   type: "mutation",
>   mutationFn: async (body: Infer["PublicOrgSetActive"]["body"]) => {
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
> const { mutate: setActive } = useApi.mutate("public:org:patch:active");
> setActive({ id: orgId }, { onSuccess: () => { ... } });
> ```

```typescript
import { Infer, MutationConfig } from '@/data/types.base';

const adminCreateModule = {
  type: "mutation",
  mutationFn: async (body: Infer["AdminModuleCreate"]["body"]) => {
    // Standard custom API endpoint route mutation:
    const data = await fetcher(
      () => axios.post(R["admin:module:post:create"](), body),
      ZModule.AdminModuleCreate.shape.res
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
  const body = ZModule.AdminModuleCreate.shape.body.parse(rawBody);
  
  // DB mutation...
  
  return JSend.success(parsedData); // Replace parsedData with the actual validated Zod result
});
```

### Step 6: Client Form Consumption (The ZForm/IForm Pattern)
Strictly type frontend forms by abstracting the schema payload using the global `Infer` helper. Do not pass explicit generics directly to `useForm`.

```tsx
import { Infer } from "@/data/types.base";
import ZModule from "@/data/api/module/module.schema";

const ZForm = ZModule.AdminModuleCreate.shape.body;
type IForm = Infer["AdminModuleCreate"]["body"];

const defaultValues: IForm = {
  title: "",
  description: ""
};

export function CreateForm() {
  const form = useForm({
    resolver: zodResolver(ZForm),
    defaultValues
  });
  
  const onSubmit = (data: IForm) => { 
    // You can safely run form.reset(defaultValues) later!
  }
}
```

---

## 5. The 5-Step Implementation Workflow (Deletes)
To create a DELETE endpoint, follow a similar structure to Mutations but typically without form integration. 

### Step 1: Define the Zod Schema (`[entity].schema.ts`)
For deletions, the payload is usually an ID passed via `body`, `query`, or `params`, and the response confirms deletion. Use `.pick()` when possible!

```typescript
import { ZApi, ZModule } from "@/data/schema.base";

const AdminModuleDelete = ZApi({
  body: z.object({
    id: z.string() // Or pick the ID from ZModule
  }),
});
```

### Step 2: Register the Route Path (`route-factory.ts`)
```typescript
"admin:module:delete": () => '/api/modules',
```

### Step 3: Create the Mutation Config (`[entity].api.ts`)
Define the mutation using `Infer` and `satisfies MutationConfig`.
> [!NOTE]
> If you are simply wrapping a Better Auth client deletion (e.g., `authClient.session.revoke()`), write the `mutationFn` to call it directly and DO NOT use `fetcher` or create a backend `route.ts` file!

```typescript
import { Infer, MutationConfig } from '@/data/types.base';

const adminDeleteModule = {
  type: "mutation",
  mutationFn: async (body: Infer["AdminModuleDelete"]["body"]) => {
    const data = await fetcher(
      () => axios.delete(R["admin:module:delete"](), { data: body }),
      ZModule.AdminModuleDelete.shape.res
    );
    return data;
  },
} satisfies MutationConfig;
```

### Step 4: Hook into the Global Registry (`registry.ts`)
Spread the module inside the `apiRegistry` object.

### Step 5: Build the Server Route (`route.ts`)
> [!WARNING]
> Skip this step completely if you are using a native Better Auth client deletion!

Wrap in `secureApiRoute` or `apiHandler`, validate the body (or params/query), perform deletion, and return `JSend.success`.
```typescript
export const DELETE = secureApiRoute(async (req, ctx, user, session) => {
  const rawBody = await req.json();
  const body = ZModule.AdminModuleDelete.shape.body.parse(rawBody);
  
  // DB deletion...
  await prisma.module.delete({ where: { id: body.id } });
  
  return JSend.success("Module deleted successfully.");
});
```
