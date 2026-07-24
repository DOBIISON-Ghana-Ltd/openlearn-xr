import { z } from "zod";
import {
  ZApi,
  ZCollection,
  ZLiveSession,
  ZModule,
  ZModuleVersion,
  ZUser,
} from "@/data/schema.base";

// ---------------------------------------------------------------------------
// POST /api/ses/sessions — create live session
// ---------------------------------------------------------------------------
const SesSessionPostCreate = ZApi({
  body: ZLiveSession.pick({ name: true }).extend({
    moduleVersionId: z.string(),
  }),
  res: ZLiveSession.pick({ id: true }),
});

// ---------------------------------------------------------------------------
// GET /api/ses/sessions — list live sessions
// ---------------------------------------------------------------------------
const SesSessionGetAll = ZApi({
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
  ),
});

// ---------------------------------------------------------------------------
// GET /api/ses/sessions/[id]/overview — session overview
// ---------------------------------------------------------------------------
const SesSessionGetOverview = ZApi({
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
  SesSessionGetAll,
  SesSessionPostCreate,
  SesSessionGetOverview,
};

export default schema;
