import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { parsePlaySlug } from "@/lib/utils/parse-play-slug";
import { handlePostSessionTestScore } from "./handle-session";
import { handlePostRemoteTestScore } from "./handle-remote";
import { handlePostLocalTestScore } from "./handle-local";

const ZPostParams = ZSim.SimGeneralPostTestScore.shape.params;
const ZPostBody = ZSim.SimGeneralPostTestScore.shape.body;

export const POST = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZPostParams.parse(parsePlaySlug(slug));

  const rawBody = await req.json();
  const { preAssessmentEarnedPoints, preAssessmentTotalPoints } = ZPostBody.parse(rawBody);
  const { mode, playId, playerId } = params;

  switch (mode) {
    case "session":
      return handlePostSessionTestScore(playerId, preAssessmentEarnedPoints, preAssessmentTotalPoints);
    case "remote":
      return handlePostRemoteTestScore(playId, preAssessmentEarnedPoints, preAssessmentTotalPoints)(req, ctx);
    case "local":
      return handlePostLocalTestScore();
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});
