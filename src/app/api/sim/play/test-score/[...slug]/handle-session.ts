import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";

export async function handlePostSessionTestScore(
  sessionPlayerId: string,
  preAssessmentEarnedPoints: number,
  preAssessmentTotalPoints: number
) {
  if (!sessionPlayerId) {
    return JSend.error("Session player ID is required.", 400);
  }

  await prisma.playAttempt.update({
    where: { sessionPlayerId },
    data: {
      preAssessmentEarnedPoints,
      preAssessmentTotalPoints,
    },
  });

  return JSend.success("Pre-assessment score recorded successfully.");
}
