/*
  Warnings:

  - The `role` column on the `collection_media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `module_progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "module_progress" DROP CONSTRAINT "module_progress_lastPlayedVersionId_fkey";

-- DropForeignKey
ALTER TABLE "module_progress" DROP CONSTRAINT "module_progress_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "module_progress" DROP CONSTRAINT "module_progress_userId_fkey";

-- AlterTable
ALTER TABLE "collection_media" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'SUPPLEMENTAL';

-- DropTable
DROP TABLE "module_progress";

-- DropEnum
DROP TYPE "CollectionMediaRole";

-- CreateTable
CREATE TABLE "collection_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "activeIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_completion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "lastPlayedVersionId" TEXT,
    "highScore" INTEGER NOT NULL DEFAULT 0,
    "totalPlays" INTEGER NOT NULL DEFAULT 0,
    "lastPlayedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_completion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_progress_userId_idx" ON "collection_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_progress_userId_collectionId_key" ON "collection_progress"("userId", "collectionId");

-- CreateIndex
CREATE INDEX "module_completion_userId_idx" ON "module_completion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "module_completion_userId_moduleId_key" ON "module_completion"("userId", "moduleId");

-- AddForeignKey
ALTER TABLE "collection_progress" ADD CONSTRAINT "collection_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_progress" ADD CONSTRAINT "collection_progress_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_completion" ADD CONSTRAINT "module_completion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_completion" ADD CONSTRAINT "module_completion_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_completion" ADD CONSTRAINT "module_completion_lastPlayedVersionId_fkey" FOREIGN KEY ("lastPlayedVersionId") REFERENCES "module_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;
