import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";

export function handlePostRemoteTestScore(
  playId: string,
  preAssessmentEarnedPoints: number,
  preAssessmentTotalPoints: number
) {
  return secureApiRoute<{ slug: string[] }>(async (req, ctx, user) => {
    await prisma.playAttempt.updateMany({
      where: { userId: user.id, moduleVersionId: playId, playMode: "module" },
      data: {
        preAssessmentEarnedPoints,
        preAssessmentTotalPoints,
      },
    });

    return JSend.success("Pre-assessment score recorded successfully.");
  });
}
