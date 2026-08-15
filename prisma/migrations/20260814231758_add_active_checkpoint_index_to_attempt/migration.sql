-- AlterTable
ALTER TABLE "module_checkpoint" ALTER COLUMN "points" SET DEFAULT 25;

-- AlterTable
ALTER TABLE "play_attempt" ADD COLUMN     "currentCheckpointIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCheckpoints" INTEGER NOT NULL DEFAULT 0;
