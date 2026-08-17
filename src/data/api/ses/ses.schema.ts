import { z } from "zod";
import {
  LiveSessionStatusEnum,
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
  body: z.object({
    name: ZLiveSession.shape.name,
    joinCode: ZLiveSession.shape.joinCode,
    moduleId: ZModuleVersion.shape.id,
    config: ZLiveSession.shape.config
  })
});

// ---------------------------------------------------------------------------
// GET /api/ses/sessions — list live sessions
// ---------------------------------------------------------------------------
const SesSessionGetAll = ZApi({
  query: z.object({
    status: z.array(LiveSessionStatusEnum).optional(),
  }).optional(),
  res: z.array(
    ZLiveSession.pick({
      id: true,
      name: true,
      status: true,
      joinCode: true,
      config: true
    }).extend({
      moduleVersion: z.object({
        module: ZModule.pick({
          title: true,
          image: true,
        }).extend({
          collection: ZCollection.pick({
            name: true,
            grade: true
          }),
        }),
      }),
      _count: z.object({
        players: z.number()
      }),
      players: z.array(
        ZSessionPlayer.pick({
          name: true,
          avatar: true
        })
      )
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

// ---------------------------------------------------------------------------
// GET /api/ses/sessions/recent — get recent sessions for current user
// ---------------------------------------------------------------------------
const SesSessionGetRecent = ZApi({
  res: z.array(
    ZLiveSession.pick({
      id: true,
      name: true,
      status: true,
      config: true,
      joinCode: true,
    }).extend({
      moduleVersion: z.object({
        module: ZModule.pick({
          title: true,
        }).extend({
          collection: ZCollection.pick({
            name: true,
            grade: true,
          }),
        }),
      }),
      _count: z.object({
        players: z.number(),
      }),
    })
  ),
});

// ---------------------------------------------------------------------------
// Module card response shape for session creation selection & preview
// ---------------------------------------------------------------------------
const SesModuleCard = ZModuleVersion.pick({
  id: true,
}).extend({
  module: ZModule.pick({
    title: true,
    duration: true,
    difficulty: true,
    image: true,
  }),
});

// ---------------------------------------------------------------------------
// GET /api/ses/modules — get all modules for session creation selection
// ---------------------------------------------------------------------------
const SesModuleGetAll = ZApi({
  query: z.object({
    search: z.string().optional(),
    subject: z.string().optional(),
    grade: z.string().optional(),
  }).optional(),
  res: z.array(SesModuleCard),
});

// ---------------------------------------------------------------------------
// GET /api/ses/modules/[id] — get single module by id for session configuration preview
// ---------------------------------------------------------------------------
const SesModuleGetOne = ZApi({
  params: z.object({
    id: z.string(),
  }),
  res: SesModuleCard,
});

// ---------------------------------------------------------------------------
// GET /api/ses/sessions/[id] — session detail by joinCode
// ---------------------------------------------------------------------------
const SesSessionGetOne = ZApi({
  params: z.object({
    code: z.string(),
  }),
  res: ZLiveSession.pick({
    id: true,
    name: true,
    status: true,
    config: true,
  }).extend({
    players: z.array(
      ZSessionPlayer.pick({
        id: true,
        name: true,
        avatar: true,
        joinedAt: true,
      })
    ),
    moduleVersion: z.object({
      module: ZModule.pick({
        title: true
      })
    })
  }),
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
  SesSessionGetRecent,
  SesModuleGetAll,
  SesModuleGetOne,
  SesSessionGetOne,
};

export default schema;
