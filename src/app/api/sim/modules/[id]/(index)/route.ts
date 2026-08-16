import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { handleGetSessionModule } from "./handle-session";
import { handleGetModuleVersion } from "./handle-module";

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = await ctx.params;
  const { id } = ZSim.SimModuleGetOne.shape.params.parse(params);
  const searchParams = ZSim.SimModuleGetOne.shape.query.parse(
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
