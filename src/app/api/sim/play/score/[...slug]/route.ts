import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { parsePlaySlug } from "@/lib/utils/parse-play-slug";
import { handleGetSessionScore } from "./handle-session";
import { handleGetRemoteScore } from "./handle-remote";
import { handleGetLocalScore } from "./handle-local";

export const GET = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZSim.SimGeneralGetScore.shape.params.parse(parsePlaySlug(slug));
  const { mode, playId, playerId } = params;

  switch (mode) {
    case "session":
      return handleGetSessionScore(playId, playerId);
    case "remote":
      return handleGetRemoteScore(playId)(req, ctx);
    case "local":
      return handleGetLocalScore();
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});
