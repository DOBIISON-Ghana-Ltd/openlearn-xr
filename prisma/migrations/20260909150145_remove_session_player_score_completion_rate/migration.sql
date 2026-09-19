/*
  Warnings:

  - You are about to drop the column `completionRate` on the `session_player` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `session_player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session_player" DROP COLUMN "completionRate",
DROP COLUMN "score";
