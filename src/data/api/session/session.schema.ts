import {
  ZApi,
  ZLiveSession,
  ZUser,
  ZModuleVersion,
  ZModule,
  ZCollection
} from "@/data/schema.base";
import { z } from "zod";

// ---------------------------------------------------------------------------
// POST /api/sessions — create a new live session
// ---------------------------------------------------------------------------
const PublicSessionCreate = ZApi({
  body: ZLiveSession.pick({ name: true }).extend({
    moduleVersionId: z.string(),
  }),
  res: ZLiveSession.pick({ id: true }),
});

const PublicSessionGetAll = ZApi({
  res: z.array(
    ZLiveSession.pick({
      id: true,
      name: true,
      status: true,
      startedAt: true,
      endedAt: true,
    }).extend({
      host: ZUser.pick({
        name: true,
        image: true,
      }),
      moduleVersion: ZModuleVersion.pick({
        versionNumber: true,
      }).extend({
        module: ZModule.pick({
          title: true,
        }).extend({
          collection: ZCollection.pick({
            name: true,
          }),
        }),
      }),
    })
  )
});

// ---------------------------------------------------------------------------
// GET /api/sessions/[id]/overview — session overview details
// ---------------------------------------------------------------------------
const PublicSessionGetOverview = ZApi({
  res: ZLiveSession.pick({
    id: true,
    name: true,
    status: true,
    joinCode: true,
    createdAt: true,
  }).extend({
    moduleVersion: ZModuleVersion.pick({
      id: true,
      versionNumber: true,
    }).extend({
      module: ZModule.pick({
        id: true,
        title: true,
      }).extend({
        overview: z.record(z.string(), z.any()).nullable(),
      }),
    }),
  }),
});

const schema = {
  PublicSessionGetAll,
  PublicSessionCreate,
  PublicSessionGetOverview,
};

export default schema;
