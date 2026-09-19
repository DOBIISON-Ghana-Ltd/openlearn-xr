import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { parsePlaySlug } from "@/lib/utils/parse-play-slug";
import { handlePostRemoteRetake } from "./handle-remote";
import { handlePostLocalRetake } from "./handle-local";

const ZPostParams = ZSim.SimGeneralPostRetake.shape.params;

export const POST = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZPostParams.parse(parsePlaySlug(slug));
  const { mode, playId } = params;

  switch (mode) {
    case "remote":
      return handlePostRemoteRetake(playId)(req, ctx);
    case "local":
      return handlePostLocalRetake(playId);
    default:
      return JSend.error("Invalid mode or retake not supported for session", 400);
  }
});
