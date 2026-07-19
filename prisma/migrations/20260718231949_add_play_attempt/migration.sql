-- CreateTable
CREATE TABLE "play_attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "moduleVersionId" TEXT NOT NULL,
    "playMode" TEXT NOT NULL,
    "currentCheckpointIndex" INTEGER NOT NULL DEFAULT 0,
    "accumulatedPoints" INTEGER NOT NULL DEFAULT 0,
    "sessionPlayerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "play_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "play_attempt_sessionPlayerId_key" ON "play_attempt"("sessionPlayerId");

-- CreateIndex
CREATE INDEX "play_attempt_userId_moduleVersionId_idx" ON "play_attempt"("userId", "moduleVersionId");

-- AddForeignKey
ALTER TABLE "play_attempt" ADD CONSTRAINT "play_attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_attempt" ADD CONSTRAINT "play_attempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "live_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_attempt" ADD CONSTRAINT "play_attempt_moduleVersionId_fkey" FOREIGN KEY ("moduleVersionId") REFERENCES "module_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_attempt" ADD CONSTRAINT "play_attempt_sessionPlayerId_fkey" FOREIGN KEY ("sessionPlayerId") REFERENCES "session_player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
