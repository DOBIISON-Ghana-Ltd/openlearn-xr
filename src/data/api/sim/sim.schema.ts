import { z } from "zod";
import {
  ZApi,
  ZCollection,
  ZModule,
  ZModuleCompletion,
  ZModuleVersion,
  ZLiveSession,
  ZSessionPlayer,
} from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET /api/sim/sessions/[id]/stats — session status & config
// ---------------------------------------------------------------------------
const SimSessionGetStats = ZApi({
  params: ZLiveSession.pick({
    id: true,
  }),
  res: ZLiveSession.pick({
    id: true,
    name: true,
    status: true,
    config: true,
  }),
});

const SimModuleGetAll = ZApi({
  query: z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    subject: z.string().optional(),
    grade: z.string().optional(),
  }).optional(),
  res: z.array(
    ZModuleVersion.pick({
      id: true,
      versionNumber: true,
      status: true,
    }).extend({
      _count: z.object({
        checkpoints: z.number().int(),
      }).optional(),
      module: ZModule.pick({
        title: true,
      }).extend({
        collection: ZCollection.pick({
          name: true,
          level: true
        })
      }),
    })
  ),
});

// ---------------------------------------------------------------------------
// GET /api/sim/modules/completions — learner module completions
// ---------------------------------------------------------------------------
const SimModuleCompletionGetAll = ZApi({
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
  ),
});

// ---------------------------------------------------------------------------
// GET /api/sim/collections — collections list for library page
// ---------------------------------------------------------------------------
const SimCollectionGetAll = ZApi({
  res: z.array(
    ZCollection.pick({
      id: true,
      name: true,
      level: true,
    }).extend({
      _count: z.object({
        modules: z.number().int(),
      }).optional(),
    })
  ),
});

// ---------------------------------------------------------------------------
// GET /api/sim/collections/[id]/modules — modules in collection for library
// ---------------------------------------------------------------------------
const SimCollectionGetModules = ZApi({
  params: z.object({
    collectionId: ZCollection.shape.id,
  }),
  res: ZCollection.pick({
    id: true,
    name: true,
    level: true,
  }).extend({
    modules: SimModuleGetAll.shape.res,
  }),
});

// ---------------------------------------------------------------------------
// GET /api/sim/modules/[id]/stats — module status & title
// ---------------------------------------------------------------------------
const SimModuleGetStats = ZApi({
  params: ZModuleVersion.pick({
    id: true,
  }),
  res: ZModuleVersion.pick({
    id: true,
    status: true,
  }).extend({
    module: ZModule.pick({
      title: true,
    }),
  }),
});

// ---------------------------------------------------------------------------
// POST /api/sim/sessions/[id]/join — join a session
// ---------------------------------------------------------------------------
const SimSessionPostJoin = ZApi({
  params: ZLiveSession.pick({
    id: true,
  }),
  body: ZLiveSession.pick({
    joinCode: true,
    name: true
  }),
  res: z.object({
    playerId: ZSessionPlayer.shape.id,
    sessionId: ZLiveSession.shape.id,
  })
});

// ---------------------------------------------------------------------------
// GET /api/sim/sessions/[id]/players — list of players in session
// ---------------------------------------------------------------------------
const SimSessionGetPlayers = ZApi({
  params: ZLiveSession.pick({
    id: true,
  }),
  res: z.array(
    ZSessionPlayer.pick({
      name: true,
      avatar: true,
      joinedAt: true,
    })
  ),
});

// ---------------------------------------------------------------------------
// POST /api/sim/sessions/[id]/leave — leave a session
// ---------------------------------------------------------------------------
const SimSessionPostLeave = ZApi({
  params: ZLiveSession.pick({
    id: true,
  }),
  body: z.object({
    playerId: ZSessionPlayer.shape.id,
  }),
});

const schema = {
  SimModuleGetAll,
  SimModuleCompletionGetAll,
  SimCollectionGetAll,
  SimCollectionGetModules,
  SimSessionGetStats,
  SimModuleGetStats,
  SimSessionPostJoin,
  SimSessionGetPlayers,
  SimSessionPostLeave,
};

export default schema;
