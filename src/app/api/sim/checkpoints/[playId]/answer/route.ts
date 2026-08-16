import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { handlePostLocalAnswer } from "./handle-local";
import { handlePostRemoteAnswer } from "./handle-remote";
import { handlePostSessionAnswer } from "./handle-session";

export const POST = apiHandler<{ playId: string }>(async (req, ctx) => {
  const params = ZSim.SimCheckpointPostAnswer.shape.params.parse(await ctx.params);
  const body = ZSim.SimCheckpointPostAnswer.shape.body.parse(await req.json());

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
