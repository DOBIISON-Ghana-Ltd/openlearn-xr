-- AlterTable
ALTER TABLE "live_session" ADD COLUMN     "currentTab" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "play_attempt" ADD COLUMN     "currentTab" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;
