/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,name]` on the table `session_player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_player_sessionId_name_key" ON "session_player"("sessionId", "name");
