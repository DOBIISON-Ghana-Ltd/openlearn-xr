import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";
import { triggerSessionEvent } from "@/adapters/realtime/server";

export const POST = apiHandler<{ id: string }>(async (req, ctx) => {
  const { id: playId } = await ctx.params;
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession?.user) {
    return JSend.error("Unauthorized", 401);
  }

  const liveSession = await prisma.liveSession.findUnique({
    where: { joinCode: playId },
    select: { id: true, hostId: true },
  });

  if (!liveSession) {
    return JSend.error("Live session not found.", 404);
  }

  if (liveSession.hostId !== userSession.user.id) {
    return JSend.error("Only the host can end this session.", 403);
  }

  await prisma.liveSession.update({
    where: { id: liveSession.id },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
    },
  });

  await triggerSessionEvent(playId, "session:ended", { joinCode: playId });

  return JSend.success("Session ended successfully.");
});
