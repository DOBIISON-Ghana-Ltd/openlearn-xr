import { ZApi, ZModule, ZModuleVersion } from "@/data/schema.base";
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

const schema = {
  PublicModuleVersionGetAll,
};

export default schema;
