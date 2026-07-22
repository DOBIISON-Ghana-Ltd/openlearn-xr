import { ZApi, ZCollection, ZModule, ZModuleCompletion, ZModuleVersion } from "@/data/schema.base";
import { z } from "zod";

// ---------------------------------------------------------------------------
// GET /api/modules/versions — all PUBLISHED module versions for combobox
// ---------------------------------------------------------------------------
const PublicModuleVersionGetAll = ZApi({
  res: z.array(
    ZModuleVersion.pick({ id: true, versionNumber: true }).extend({
      module: ZModule.pick({ id: true, title: true }),
    })
  )
});

// ---------------------------------------------------------------------------
// GET /api/modules/completions — all module completions for current user
// ---------------------------------------------------------------------------
const PublicModuleCompletionGetAll = ZApi({
  res: z.array(
    ZModuleCompletion.pick({
      id: true,
      highScore: true,
      totalPlays: true,
      lastPlayedAt: true,
    }).extend({
      module: ZModule.pick({
        id: true,
        title: true,
      }).extend({
        collection: ZCollection.pick({
          name: true,
        }),
      }),
      lastPlayedVersion: ZModuleVersion.pick({
        versionNumber: true,
      }).nullable(),
    })
  )
});

// ---------------------------------------------------------------------------
// GET /api/editor/collections — minimal collection data for editor table
// ---------------------------------------------------------------------------
const PublicCollectionGetAll = ZApi({
  res: z.array(
    ZCollection.pick({
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    }).extend({
      _count: z.object({
        modules: z.number().int(),
      }).optional(),
    })
  )
});

// ---------------------------------------------------------------------------
// GET /api/editor/modules — minimal module data for editor table
// ---------------------------------------------------------------------------
const PublicModuleGetAll = ZApi({
  res: z.array(
    ZModule.pick({
      id: true,
      title: true,
      slug: true,
      orderIndex: true,
      createdAt: true,
      updatedAt: true,
    }).extend({
      collection: ZCollection.pick({
        id: true,
        name: true,
      }),
    })
  )
});

// ---------------------------------------------------------------------------
// POST /api/editor/collections — create a new collection
// ---------------------------------------------------------------------------
const PublicCollectionCreate = ZApi({
  body: ZCollection.pick({
    name: true,
    description: true,
  }),
  res: ZCollection.pick({
    id: true,
  }),
});

// ---------------------------------------------------------------------------
// POST /api/editor/modules — create a new module
// ---------------------------------------------------------------------------
const PublicModuleCreate = ZApi({
  body: ZModule.pick({
    title: true,
  }).extend({
    collectionId: z.string().min(1, "Collection is required"),
    topicId: z.string().optional(),
  }),
  res: ZModule.pick({
    id: true,
  }),
});

const schema = {
  PublicModuleVersionGetAll,
  PublicModuleCompletionGetAll,
  PublicCollectionGetAll,
  PublicModuleGetAll,
  PublicCollectionCreate,
  PublicModuleCreate,
};

export default schema;
