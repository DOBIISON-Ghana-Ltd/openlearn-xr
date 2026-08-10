/*
  Warnings:

  - You are about to drop the column `currentCheckpointIndex` on the `play_attempt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "play_attempt" DROP COLUMN "currentCheckpointIndex",
ADD COLUMN     "currentCheckpointId" TEXT;

-- AddForeignKey
ALTER TABLE "play_attempt" ADD CONSTRAINT "play_attempt_currentCheckpointId_fkey" FOREIGN KEY ("currentCheckpointId") REFERENCES "module_checkpoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
