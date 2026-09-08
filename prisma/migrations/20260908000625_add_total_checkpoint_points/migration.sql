-- AlterTable
ALTER TABLE "play_attempt" ADD COLUMN     "preAssessmentEarnedPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preAssessmentTotalPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCheckpointPoints" INTEGER NOT NULL DEFAULT 0;
