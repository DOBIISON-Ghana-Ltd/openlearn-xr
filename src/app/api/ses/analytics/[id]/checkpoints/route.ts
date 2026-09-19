import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import ZSes from "@/data/api/ses/ses.schema";
import prisma from "@/adapters/db/client";

const ZGetParams = ZSes.SesAnalyticsGetCheckpoints.shape.params;
const ZGetRes = ZSes.SesAnalyticsGetCheckpoints.shape.res;

type AnswerPayload = {
  questionIndex?: number;
  selectedIndex?: number;
  isCorrect?: boolean;
};

export const GET = secureApiRoute<{ id: string }>(async (req, ctx, user) => {
  const { id } = ZGetParams.parse(await ctx.params);

  const [checkpoints, analytics] = await Promise.all([
    prisma.sessionCheckpoint.findMany({
      where: {
        sessionId: id,
        session: {
          hostId: user.id,
        },
      },
      orderBy: {
        checkpoint: {
          orderIndex: "asc",
        },
      },
      select: {
        id: true,
        checkpoint: {
          select: {
            id: true,
            question: true,
            options: true,
            correctAnswer: true,
            orderIndex: true,
          },
        },
      },
    }),
    prisma.sessionAnalytic.findMany({
      where: {
        sessionId: id,
        event: "post-test:changed",
      },
      select: {
        playerId: true,
        payload: true,
        recordedAt: true,
      },
      orderBy: {
        recordedAt: "asc",
      },
    }),
  ]);

  const answersPerQuestion = new Map<number, Map<string, { selectedIndex: number; isCorrect: boolean }>>();
  for (const record of analytics) {
    const payload = record.payload as AnswerPayload | null;
    if (payload && typeof payload.questionIndex === "number" && typeof payload.selectedIndex === "number") {
      if (!answersPerQuestion.has(payload.questionIndex)) {
        answersPerQuestion.set(payload.questionIndex, new Map());
      }
      answersPerQuestion.get(payload.questionIndex)!.set(record.playerId, {
        selectedIndex: payload.selectedIndex,
        isCorrect: Boolean(payload.isCorrect),
      });
    }
  }

  const results = checkpoints.map((sc, index) => {
    const cp = sc.checkpoint;
    const questionNumber = index + 1;
    const answersMap = answersPerQuestion.get(index);
    const totalAnswers = answersMap ? answersMap.size : 0;

    let correctCount = 0;
    const wrongOptionCounts = new Map<number, number>();

    if (answersMap) {
      for (const { selectedIndex, isCorrect } of answersMap.values()) {
        if (isCorrect || selectedIndex === cp.correctAnswer) {
          correctCount++;
        } else {
          wrongOptionCounts.set(selectedIndex, (wrongOptionCounts.get(selectedIndex) ?? 0) + 1);
        }
      }
    }

    const accuracy = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;

    const commonErrors = Array.from(wrongOptionCounts.entries())
      .map(([optIdx, count]) => ({
        option: cp.options[optIdx] ?? `Option ${String.fromCharCode(65 + optIdx)}`,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const correctAnswerText = cp.options[cp.correctAnswer] ?? `Option ${String.fromCharCode(65 + cp.correctAnswer)}`;

    return {
      id: sc.id,
      questionNumber,
      question: cp.question,
      correctAnswer: correctAnswerText,
      accuracy,
      commonErrors,
    };
  });

  const parsedData = ZGetRes.parse(results);
  return JSend.success(parsedData);
});
