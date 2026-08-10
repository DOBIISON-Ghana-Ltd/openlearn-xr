import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";

export const GET = apiHandler<{ playId: string }>(async (req, ctx) => {
  const params = ZSim.SimCheckpointGetOne.shape.params.parse(await ctx.params);
  const searchParams = ZSim.SimCheckpointGetOne.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const { playId } = params;
  const { mode, checkpointId, playerId } = searchParams;

  // -------------------------------------------------------------------------
  // 1. LOCAL MODE (module:local) — Guest / Offline play
  // -------------------------------------------------------------------------
  if (mode === "module:local") {
    const checkpoints = await prisma.moduleCheckpoint.findMany({
      where: { moduleVersionId: playId },
      orderBy: { orderIndex: "asc" },
    });

    const totalCheckpoints = checkpoints.length;

    if (totalCheckpoints === 0) {
      return JSend.error("No checkpoints found for this module version", 404);
    }

    let activeIndex = 0;
    if (checkpointId) {
      const idx = checkpoints.findIndex((c) => c.id === checkpointId);
      if (idx !== -1) activeIndex = idx;
    }

    const activeCheckpoint = checkpoints[activeIndex] ?? checkpoints[0];

    const resData = {
      checkpoint: {
        question: activeCheckpoint.question,
        options: activeCheckpoint.options,
        points: activeCheckpoint.points,
        orderIndex: activeCheckpoint.orderIndex,
        hint: activeCheckpoint.hint,
      },
      meta: {
        checkpointId: checkpointId ? null : activeCheckpoint.id,
        currentCheckpointIndex: activeIndex,
        totalCheckpoints,
        accumulatedPoints: 0,
      },
    };

    return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
  }

  // -------------------------------------------------------------------------
  // 2. REMOTE MODULE MODE (module:remote) — Solo Cloud Play
  // -------------------------------------------------------------------------
  if (mode === "module:remote") {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession?.user) {
      return JSend.error("Unauthorized: Please sign in to play remote modules", 401);
    }

    const userId = userSession.user.id;

    const checkpoints = await prisma.moduleCheckpoint.findMany({
      where: { moduleVersionId: playId },
      orderBy: { orderIndex: "asc" },
    });

    const totalCheckpoints = checkpoints.length;

    if (totalCheckpoints === 0) {
      return JSend.error("No checkpoints found for this module version", 404);
    }

    // Lookup existing attempt for logged-in user in Postgres
    let attempt = await prisma.playAttempt.findFirst({
      where: { userId, moduleVersionId: playId, playMode: "module" },
    });

    let activeIndex = 0;
    const currentCheckpointId = attempt?.currentCheckpointId;
    if (currentCheckpointId) {
      const idx = checkpoints.findIndex((c) => c.id === currentCheckpointId);
      if (idx !== -1) activeIndex = idx;
    }

    // Initialize attempt in Postgres linked to userId if first time
    if (!attempt) {
      attempt = await prisma.playAttempt.create({
        data: {
          userId,
          moduleVersionId: playId,
          playMode: "module",
          currentCheckpointId: checkpoints[0]?.id ?? null,
          accumulatedPoints: 0,
        },
      });
    }

    const activeCheckpoint = checkpoints[activeIndex] ?? checkpoints[0];

    const resData = {
      checkpoint: {
        question: activeCheckpoint.question,
        options: activeCheckpoint.options,
        points: activeCheckpoint.points,
        orderIndex: activeCheckpoint.orderIndex,
        hint: activeCheckpoint.hint,
      },
      meta: {
        checkpointId: null,
        currentCheckpointIndex: activeIndex,
        totalCheckpoints,
        accumulatedPoints: attempt.accumulatedPoints,
      },
    };

    return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
  }

  // -------------------------------------------------------------------------
  // 3. SESSION MODE (session) — Live Classroom Multiplayer Session
  // -------------------------------------------------------------------------
  if (mode === "session") {
    const sessionCheckpoints = await prisma.sessionCheckpoint.findMany({
      where: { sessionId: playId, isEnabled: true },
      include: { checkpoint: true },
      orderBy: { checkpoint: { orderIndex: "asc" } },
    });

    const checkpoints = sessionCheckpoints.map((sc) => sc.checkpoint);
    const totalCheckpoints = checkpoints.length;

    if (totalCheckpoints === 0) {
      return JSend.error("No enabled checkpoints found for this session", 404);
    }

    let attempt = await prisma.playAttempt.findFirst({
      where: { sessionId: playId },
    });

    let activeIndex = 0;
    const sessionCheckpointId = attempt?.currentCheckpointId;
    if (sessionCheckpointId) {
      const idx = checkpoints.findIndex((c) => c.id === sessionCheckpointId);
      if (idx !== -1) activeIndex = idx;
    }

    if (!attempt) {
      attempt = await prisma.playAttempt.create({
        data: {
          sessionId: playId,
          moduleVersionId: checkpoints[0].moduleVersionId,
          playMode: "session",
          sessionPlayerId: playerId ?? null,
          currentCheckpointId: checkpoints[0]?.id ?? null,
          accumulatedPoints: 0,
        },
      });
    }

    const activeCheckpoint = checkpoints[activeIndex] ?? checkpoints[0];

    const resData = {
      checkpoint: {
        question: activeCheckpoint.question,
        options: activeCheckpoint.options,
        points: activeCheckpoint.points,
        orderIndex: activeCheckpoint.orderIndex,
        hint: activeCheckpoint.hint,
      },
      meta: {
        checkpointId: null,
        currentCheckpointIndex: activeIndex,
        totalCheckpoints,
        accumulatedPoints: attempt.accumulatedPoints,
      },
    };

    return JSend.success(ZSim.SimCheckpointGetOne.shape.res.parse(resData));
  }

  return JSend.error("Invalid mode specified", 400);
});