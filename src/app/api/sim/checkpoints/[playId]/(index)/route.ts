import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { handleGetLocalCheckpoint } from "./handle-local";
import { handleGetRemoteCheckpoint } from "./handle-remote";
import { handleGetSessionCheckpoint } from "./handle-session";

export const GET = apiHandler<{ playId: string }>(async (req, ctx) => {
  const params = ZSim.SimCheckpointGetOne.shape.params.parse(await ctx.params);
  const searchParams = ZSim.SimCheckpointGetOne.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const { playId } = params;
  const { mode, checkpointId, playerId } = searchParams;

  switch (mode) {
    case "local":
      return handleGetLocalCheckpoint(checkpointId);
    case "remote":
      return handleGetRemoteCheckpoint(playId)(req, ctx);
    case "session":
      return handleGetSessionCheckpoint(playId, playerId || "");
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});