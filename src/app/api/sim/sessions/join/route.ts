import { apiHandler, ApiError } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";
import { ZSessionConfig } from "@/data/schema.base";
import prisma from "@/adapters/db/client";
import { triggerSessionEvent } from "@/adapters/realtime/server";
import type { LiveSession } from "@/generated/prisma/client";

const ZPostBody = ZSim.SimSessionPostJoin.shape.body;
const ZPostRes = ZSim.SimSessionPostJoin.shape.res;

export const POST = apiHandler(async (req) => {
  const rawBody = await req.json();
  const body = ZPostBody.parse(rawBody);

  const { liveSession, player } = await prisma.$transaction(async (tx) => {
    // 🔒 Lock the row — concurrent joins queue here until the transaction commits
    const [liveSession] = await tx.$queryRaw<LiveSession[]>`
      SELECT * FROM "live_session"
      WHERE "joinCode" = ${body.joinCode}
      FOR UPDATE
    `;

    if (!liveSession) {
      throw new ApiError("Session not found.", 404);
    }

    if (liveSession.status === "COMPLETED" || liveSession.status === "CANCELLED") {
      throw new ApiError("This session is no longer active.", 400);
    }

    const config = ZSessionConfig.parse(liveSession.config);

    if (liveSession.status === "ACTIVE" && !config.allowLateAdmissions) {
      throw new ApiError("Late admissions are not allowed for this active session.", 403);
    }

    const currentCount = await tx.sessionPlayer.count({
      where: { sessionId: liveSession.id },
    });

    if (currentCount >= config.maxAdmissions) {
      throw new ApiError("This session has reached its maximum participant limit.", 403);
    }

    const player = await tx.sessionPlayer.create({
      data: {
        sessionId: liveSession.id,
        name: body.name,
        avatar: body.avatar || "avatar-01",
      },
    });

    return { liveSession, player };
  });

  await triggerSessionEvent(body.joinCode, "player:joined", {
    participantId: player.id,
    name: player.name,
  });

  const parsedData = ZPostRes.parse({
    playerId: player.id,
    sessionId: liveSession.id,
    joinCode: liveSession.joinCode,
    config: liveSession.config,
  });

  return JSend.success(parsedData);
});
