import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { handlePostLocalAnswer } from "./handle-local";
import { handlePostRemoteAnswer } from "./handle-remote";
import { handlePostSessionAnswer } from "./handle-session";

const ZPostParams = ZSim.SimCheckpointPostAnswer.shape.params;
const ZPostBody = ZSim.SimCheckpointPostAnswer.shape.body;

export const POST = apiHandler<{ playId: string }>(async (req, ctx) => {
  const params = ZPostParams.parse(await ctx.params);
  const body = ZPostBody.parse(await req.json());

  const { playId } = params;
  const { mode } = body;

  switch (mode) {
    case "local":
      return handlePostLocalAnswer(playId, body);
    case "remote":
      return handlePostRemoteAnswer(playId, body)(req, ctx);
    case "session":
      return handlePostSessionAnswer(playId, body);
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});
