import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { parsePlaySlug } from "@/lib/utils/parse-play-slug";
import { handleGetSessionNav, handlePostSessionNav } from "./handle-session";
import { handleGetRemoteNav, handlePostRemoteNav } from "./handle-remote";
import { handleGetLocalNav, handlePostLocalNav } from "./handle-local";

export const GET = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZSim.SimGeneralGetNavigate.shape.params.parse(parsePlaySlug(slug));
  const searchParams = ZSim.SimGeneralGetNavigate.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const { mode, playId, playerId } = params;
  const { isHost } = searchParams;

  switch (mode) {
    case "session":
      return handleGetSessionNav(playId, playerId, isHost);
    case "remote":
      return handleGetRemoteNav(playId)(req, ctx);
    case "local":
      return handleGetLocalNav(playId);
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});

export const POST = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZSim.SimGeneralPostNavigate.shape.params.parse(parsePlaySlug(slug));

  const rawBody = await req.json();
  const { nextTab, isHost } = ZSim.SimGeneralPostNavigate.shape.body.parse(rawBody);
  const { mode, playId, playerId } = params;

  switch (mode) {
    case "session":
      return handlePostSessionNav(playId, playerId, nextTab, isHost);
    case "remote":
      return handlePostRemoteNav(playId, nextTab)(req, ctx);
    case "local":
      return handlePostLocalNav();
    default:
      return JSend.error("Invalid mode specified", 400);
  }
});
