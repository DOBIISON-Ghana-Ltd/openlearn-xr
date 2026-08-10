import { apiHandler } from "@/lib/utils/api-handler";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { headers } from "next/headers";
import { auth } from "@/adapters/auth/server";
import { persistAttemptCompletion } from "@/lib/actions/persist-attempt-completion";

export const POST = apiHandler<{ playId: string }>(async (req, ctx) => {
  const params = ZSim.SimCheckpointPostAnswer.shape.params.parse(await ctx.params);
  const body = ZSim.SimCheckpointPostAnswer.shape.body.parse(await req.json());

  const { playId } = params;
  const { mode, selectedIndex, sessionPlayerId } = body;

  let targetCheckpointId: string | null = null;
  let attemptIdToUpdate: string | null = null;
  let currentAccumulatedPoints = 0;
  let userId: string | null = null;

  // -------------------------------------------------------------------------
  // 1. DETERMINE TARGET CHECKPOINT ID BY MODE
  // -------------------------------------------------------------------------
  if (mode === "module:local") {
    if (!body.checkpointId) {
      return JSend.error("checkpointId is required in body for module:local mode", 400);
    }
    targetCheckpointId = body.checkpointId;
  } else if (mode === "module:remote") {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession?.user) {
      return JSend.error("Unauthorized: Please sign in to answer checkpoint questions", 401);
    }

    userId = userSession.user.id;

    // Lookup existing attempt in Postgres (initialized during GET)
    const attempt = await prisma.playAttempt.findFirst({
      where: { userId, moduleVersionId: playId, playMode: "module" },
    });

    if (!attempt || !attempt.currentCheckpointId) {
      return JSend.error("Play attempt not initialized. Please fetch checkpoint first", 404);
    }

    targetCheckpointId = attempt.currentCheckpointId;
    attemptIdToUpdate = attempt.id;
    currentAccumulatedPoints = attempt.accumulatedPoints;
  } else if (mode === "session") {
    // Lookup existing session attempt in Postgres (initialized during GET)
    const attempt = await prisma.playAttempt.findFirst({
      where: { sessionId: playId },
    });

    if (!attempt || !attempt.currentCheckpointId) {
      return JSend.error("Session play attempt not initialized. Please fetch checkpoint first", 404);
    }

    targetCheckpointId = attempt.currentCheckpointId;
    attemptIdToUpdate = attempt.id;
    currentAccumulatedPoints = attempt.accumulatedPoints;
  }

  if (!targetCheckpointId) {
    return JSend.error("Active checkpoint could not be determined", 400);
  }

  // -------------------------------------------------------------------------
  // 2. FETCH CHECKPOINT & EVALUATE ANSWER
  // -------------------------------------------------------------------------
  const checkpoint = await prisma.moduleCheckpoint.findUnique({
    where: { id: targetCheckpointId },
    include: {
      moduleVersion: {
        select: { moduleId: true },
      },
    },
  });

  if (!checkpoint) {
    return JSend.error("Checkpoint not found", 404);
  }

  const isCorrect = selectedIndex === checkpoint.correctAnswer;
  const pointsAwarded = isCorrect ? checkpoint.points : 0;
  const moduleId = checkpoint.moduleVersion.moduleId;

  // -------------------------------------------------------------------------
  // 3. DETERMINE NEXT CHECKPOINT ID & UPDATE OR PERSIST ATTEMPT
  // -------------------------------------------------------------------------
  let nextCheckpointId = "";

  if (mode === "session") {
    // Session mode: Order enabled session checkpoints by checkpoint.orderIndex
    const sessionCheckpoints = await prisma.sessionCheckpoint.findMany({
      where: { sessionId: playId, isEnabled: true },
      include: { checkpoint: true },
      orderBy: { checkpoint: { orderIndex: "asc" } },
    });

    const checkpoints = sessionCheckpoints.map((sc) => sc.checkpoint);
    const currentIdx = checkpoints.findIndex((c) => c.id === targetCheckpointId);

    if (currentIdx !== -1 && currentIdx < checkpoints.length - 1) {
      nextCheckpointId = checkpoints[currentIdx + 1].id;
    }
  } else {
    // Module mode (local or remote): Order checkpoints by orderIndex
    const moduleVersionId = checkpoint.moduleVersionId;
    const checkpoints = await prisma.moduleCheckpoint.findMany({
      where: { moduleVersionId },
      orderBy: { orderIndex: "asc" },
    });

    const currentIdx = checkpoints.findIndex((c) => c.id === targetCheckpointId);

    if (currentIdx !== -1 && currentIdx < checkpoints.length - 1) {
      nextCheckpointId = checkpoints[currentIdx + 1].id;
    }
  }

  // Handle Postgres persistence/attempt deletion or update
  if (attemptIdToUpdate && (mode === "module:remote" || mode === "session")) {
    const finalScore = currentAccumulatedPoints + pointsAwarded;

    if (!nextCheckpointId) {
      // Attempt Completed! Persist score to ModuleCompletion/SessionPlayer and DELETE attempt
      await persistAttemptCompletion({
        attemptId: attemptIdToUpdate,
        mode,
        userId,
        playId,
        finalScore,
        sessionPlayerId,
      });
    } else {
      // Attempt in progress: update currentCheckpointId and increment points
      await prisma.playAttempt.update({
        where: { id: attemptIdToUpdate },
        data: {
          currentCheckpointId: nextCheckpointId,
          accumulatedPoints: { increment: pointsAwarded },
        },
      });
    }
  }

  // -------------------------------------------------------------------------
  // 4. RETURN JSEND RESPONSE
  // -------------------------------------------------------------------------
  const resData = {
    isCorrect,
    correctAnswer: checkpoint.correctAnswer,
    explanation: checkpoint.explanation,
    pointsAwarded,
    nextCheckpointId,
    moduleId,
  };

  return JSend.success(ZSim.SimCheckpointPostAnswer.shape.res.parse(resData));
});
