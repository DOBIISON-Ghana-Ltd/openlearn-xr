import { z } from "zod";
import {
  ZApi,
  ZCollection,
  ZModule,
  ZModuleCompletion,
  ZModuleVersion,
} from "@/data/schema.base";

// ---------------------------------------------------------------------------
// GET /api/sim/modules — module versions for simulation dashboard
// ---------------------------------------------------------------------------
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
// GET /api/sim/modules/versions — published versions for options select
// ---------------------------------------------------------------------------
const SimModuleVersionGetOptions = ZApi({
  res: z.array(
    ZModuleVersion.pick({ id: true, versionNumber: true }).extend({
      module: ZModule.pick({ id: true, title: true }),
    })
  ),
});

const schema = {
  SimModuleGetAll,
  SimModuleCompletionGetAll,
  SimModuleVersionGetOptions,
};

export default schema;
