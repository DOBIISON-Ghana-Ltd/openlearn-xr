import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { handleGetSessionModule } from "./handle-session";
import { handleGetModuleVersion } from "./handle-module";

const ZGetParams = ZSim.SimModuleGetOne.shape.params;
const ZGetQuery = ZSim.SimModuleGetOne.shape.query;

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { id } = ZGetParams.parse(params);
  const searchParams = ZGetQuery.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const mode = searchParams.mode ?? "module";

  switch (mode) {
    case "session":
      return handleGetSessionModule(id);
    case "module":
      return handleGetModuleVersion(id);
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});
