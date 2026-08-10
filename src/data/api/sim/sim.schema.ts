import { z } from "zod";
import {
  ZApi,
  ZCollection,
  ZModule,
  ZModuleCompletion,
  ZModuleVersion,
  ZLiveSession,
  ZSessionPlayer,
  ZModuleCheckpoint,
} from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET /api/sim/modules — all modules
// ---------------------------------------------------------------------------
const SimModuleGetAll = ZApi({
  query: z.object({
    search: z.string().optional(),
    subject: z.string().optional(),
    grade: z.string().optional(),
  }).optional(),
  res: z.object({
    id: ZModuleVersion.shape.id,
    module: z.object({
      title: ZModule.shape.title,
      slug: ZModule.shape.slug,
      collection: z.object({
        name: ZCollection.shape.name,
        grade: ZCollection.shape.grade
      })
    })
  }).array()
});

const SimModuleGetOne = ZApi({
  params: z.object({
    id: z.string(),
  }),
  query: z.object({
    mode: z.enum(["module", "session"]).optional(),
  }),
  res: z.object({
    notes: ZModuleVersion.shape.notes,
    module: z.object({
      title: ZModule.shape.title,
      duration: ZModule.shape.duration,
      difficulty: ZModule.shape.difficulty,
      description: ZModule.shape.description,
      collection: z.object({
        name: ZCollection.shape.name,
        grade: ZCollection.shape.grade
      })
    })
  })
});

const SimCheckpointGetOne = ZApi({
  params: z.object({
    playId: z.string() // moduleVersionId or sessionId
  }),
  query: z.object({
    mode: z.enum(["module:local", "module:remote", "session"]),
    checkpointId: z.string().optional(),
    playerId: z.string().optional(),
  }),
  res: z.object({
    checkpoint: z.object({
      question: ZModuleCheckpoint.shape.question,
      options: ZModuleCheckpoint.shape.options,
      points: ZModuleCheckpoint.shape.points,
      orderIndex: ZModuleCheckpoint.shape.orderIndex,
      hint: ZModuleCheckpoint.shape.hint,
    }),
    meta: z.object({
      checkpointId: z.string().nullable(),
      currentCheckpointIndex: z.number().int(),
      totalCheckpoints: z.number().int(),
      accumulatedPoints: z.number().int(),
    }),
  }),
});

const SimCheckpointPostAnswer = ZApi({
  params: z.object({
    playId: z.string() // moduleVersionId or sessionId
  }),
  body: z.object({
    mode: z.enum(["module:local", "module:remote", "session"]),
    checkpointId: z.string().optional(),
    sessionPlayerId: z.string().optional(),
    selectedIndex: z.number().int(),
  }),
  res: z.object({
    isCorrect: z.boolean(),
    correctAnswer: z.number().int(),
    explanation: z.string(),
    pointsAwarded: z.number().int(),
    nextCheckpointId: z.string(),
    moduleId: z.string().optional(),
  }),
});

const SimGeneralGetScore = ZApi({
  params: z.object({
    playId: z.string(),
  }),
  query: z.object({
    mode: z.enum(["module:local", "module:remote", "session"]),
    playerId: z.string().optional(),
  }),
  res: z.object({
    score: z.number().int(),
    moduleId: z.string().optional(),
  }),
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
      grade: true,
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
    grade: true,
  }).extend({
    modules: SimModuleGetAll.shape.res,
  }),
});

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
      id: true,
      name: true,
      avatar: true,
      joinedAt: true,
      score: true,
      completedAt: true
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
  SimModuleGetOne,
  SimCheckpointGetOne,
  SimCheckpointPostAnswer,
  SimGeneralGetScore,
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
