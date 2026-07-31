import { z } from "zod";
import {
  ZApi,
  ZCollection,
  ZLiveSession,
  ZModule,
  ZModuleVersion,
  ZPlayAttempt,
  ZSessionPlayer,
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
            level: true
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
  params: ZLiveSession.pick({ id: true }),
  res: ZLiveSession.pick({
    id: true,
    name: true,
    status: true,
    joinCode: true,
    createdAt: true,
  }).extend({
    moduleVersion: ZModuleVersion.pick({
      versionNumber: true
    }).extend({
      module: ZModule.pick({
        title: true,
      })
    }),
  }),
});

// ---------------------------------------------------------------------------
// GET /api/ses/modules/versions — module version dropdown options for session creation
// ---------------------------------------------------------------------------
const SesModuleVersionGetOptions = ZApi({
  res: z.array(
    ZModuleVersion.pick({
      id: true,
      versionNumber: true,
    }).extend({
      module: ZModule.pick({
        title: true,
      }),
    })
  ),
});

// ---------------------------------------------------------------------------
// GET /api/ses/sessions/[id]/notes — session notes
// ---------------------------------------------------------------------------
const SesSessionGetNotes = ZApi({
  params: ZLiveSession.pick({ id: true }),
  res: ZModuleVersion.pick({
    notes: true,
  }),
});

// ---------------------------------------------------------------------------
// GET /api/ses/sessions/[id]/players — session players list
// ---------------------------------------------------------------------------
const SesSessionGetPlayers = ZApi({
  params: ZLiveSession.pick({ id: true }),
  res: z.array(
    ZSessionPlayer.pick({
      id: true,
      name: true,
      avatar: true,
    }).extend({
      user: ZUser.pick({
        image: true,
      }).nullable(),
    })
  ),
});

// ---------------------------------------------------------------------------
// POST /api/ses/sessions/[id]/start — start live session
// ---------------------------------------------------------------------------
const SesSessionPostStart = ZApi({
  params: ZLiveSession.pick({ id: true }),
});

// ---------------------------------------------------------------------------
// GET /api/ses/sessions/[id]/player-summary — session player summary
// ---------------------------------------------------------------------------
const SesSessionGetPlayerSummary = ZApi({
  params: ZLiveSession.pick({ id: true }),
  res: z.array(
    ZSessionPlayer.pick({
      name: true,
      avatar: true,
      score: true,
    }).extend({
      playAttempt: ZPlayAttempt.pick({
        accumulatedPoints: true,
      }).nullable(),
    })
  ),
});

const schema = {
  SesSessionGetAll,
  SesSessionPostCreate,
  SesSessionGetOverview,
  SesSessionGetNotes,
  SesSessionGetPlayers,
  SesModuleVersionGetOptions,
  SesSessionPostStart,
  SesSessionGetPlayerSummary,
};

export default schema;
