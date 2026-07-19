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

const schema = {
  PublicModuleVersionGetAll,
  PublicModuleCompletionGetAll,
};

export default schema;
