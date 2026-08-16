import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { handleGetSessionSlug } from "./handle-session";
import { handleGetModuleSlug } from "./handle-module";

export const GET = apiHandler<{ id: string }>(async (req, ctx) => {
  const params = ZSim.SimModuleGetSlug.shape.params.parse(await ctx.params);
  const searchParams = ZSim.SimModuleGetSlug.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const { id } = params;
  const mode = searchParams?.mode ?? "module";

  switch (mode) {
    case "session":
      return handleGetSessionSlug(id);
    case "module":
      return handleGetModuleSlug(id);
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});
