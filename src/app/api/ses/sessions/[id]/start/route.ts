import prisma from "@/adapters/db/client";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { triggerSessionEvent } from "@/adapters/realtime/server";

export const POST = secureApiRoute<{ id: string }>(async (req, ctx) => {
  const { id } = await ctx.params;

  const res = await prisma.liveSession.update({
    where: { id },
    data: {
      status: "ACTIVE",
      startedAt: new Date(),
    },
    select: {
      joinCode: true
    }
  });

  await triggerSessionEvent(res.joinCode, "session:started", { joinCode: res.joinCode });

  return JSend.success("Session started successfully");
});
