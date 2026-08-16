import { z } from "zod";
import {
  ZApi,
  ZCollection,
  ZCollectionMedia,
  ZMedia,
  ZModule,
  ZModuleVersion,
} from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET /api/editor/collections — collections for editor table
// ---------------------------------------------------------------------------
const EditorCollectionGetAll = ZApi({
  res: z.array(
    ZCollection.pick({
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    }).extend({
      _count: z
        .object({
          modules: z.number().int(),
        })
        .optional(),
    })
  ),
});

// ---------------------------------------------------------------------------
// POST /api/editor/collections — create a new collection
// ---------------------------------------------------------------------------
const EditorCollectionPostCreate = ZApi({
  body: ZCollection.pick({
    name: true,
    description: true,
  }),
  res: ZCollection.pick({
    id: true,
  }),
});

// ---------------------------------------------------------------------------
// GET /api/editor/collections/:collectionId/documents — collection documents
// ---------------------------------------------------------------------------
const EditorCollectionGetDocuments = ZApi({
  params: z.object({
    collectionId: z.string().min(1, "Collection ID is required"),
  }),
  res: z.array(
    ZCollectionMedia.pick({
      id: true,
      createdAt: true,
    }).extend({
      media: ZMedia.pick({
        id: true,
        fileName: true,
        mimeType: true,
        key: true,
        status: true,
        folder: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      }),
    })
  ),
});

// ---------------------------------------------------------------------------
// PATCH /api/editor/collections/:id — update collection details
// ---------------------------------------------------------------------------
const EditorCollectionPatchDetails = ZApi({
  params: ZCollection.pick({
    id: true,
  }),
  body: ZCollection.pick({
    name: true,
    description: true,
  }),
});

// ---------------------------------------------------------------------------
// GET /api/editor/modules — minimal module data for editor table
// ---------------------------------------------------------------------------
const EditorModuleGetAll = ZApi({
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
  ),
});

// ---------------------------------------------------------------------------
// POST /api/editor/modules — create a new module
// ---------------------------------------------------------------------------
const EditorModulePostCreate = ZApi({
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
  EditorCollectionGetAll,
  EditorCollectionPostCreate,
  EditorCollectionGetDocuments,
  EditorCollectionPatchDetails,
  EditorModuleGetAll,
  EditorModulePostCreate,
};

export default schema;
