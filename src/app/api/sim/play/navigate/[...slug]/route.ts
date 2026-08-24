import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { parsePlaySlug } from "@/lib/utils/parse-play-slug";
import { handleGetSessionNav, handlePostSessionNav } from "./handle-session";
import { handleGetRemoteNav, handlePostRemoteNav } from "./handle-remote";
import { handleGetLocalNav, handlePostLocalNav } from "./handle-local";

const ZGetParams = ZSim.SimGeneralGetNavigate.shape.params;
const ZGetQuery = ZSim.SimGeneralGetNavigate.shape.query;

export const GET = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZGetParams.parse(parsePlaySlug(slug));
  const searchParams = ZGetQuery.parse(
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

const ZPostParams = ZSim.SimGeneralPostNavigate.shape.params;
const ZPostBody = ZSim.SimGeneralPostNavigate.shape.body;

export const POST = apiHandler<{ slug: string[] }>(async (req, ctx) => {
  const { slug } = await ctx.params;
  const params = ZPostParams.parse(parsePlaySlug(slug));

  const rawBody = await req.json();
  const { nextTab, isHost } = ZPostBody.parse(rawBody);
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
