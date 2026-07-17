/*
  Warnings:

  - You are about to drop the column `coverMediaId` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `collectionId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `module` table. All the data in the column will be lost.
  - You are about to drop the column `triggerAt` on the `module_checkpoint` table. All the data in the column will be lost.
  - You are about to drop the column `simulationData` on the `module_version` table. All the data in the column will be lost.
  - Added the required column `correctAnswer` to the `module_checkpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interactiveConfig` to the `module_version` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollectionMediaRole" AS ENUM ('PRIMARY', 'SUPPLEMENTAL');

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_collectionId_fkey";

-- DropIndex
DROP INDEX "media_collectionId_idx";

-- AlterTable
ALTER TABLE "collection" DROP COLUMN "coverMediaId";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "collectionId";

-- AlterTable
ALTER TABLE "module" DROP COLUMN "thumbnail";

-- AlterTable
ALTER TABLE "module_checkpoint" DROP COLUMN "triggerAt",
ADD COLUMN     "correctAnswer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "module_version" DROP COLUMN "simulationData",
ADD COLUMN     "interactiveConfig" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "collection_media" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "role" "CollectionMediaRole" NOT NULL DEFAULT 'SUPPLEMENTAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_media_collectionId_idx" ON "collection_media"("collectionId");

-- CreateIndex
CREATE INDEX "collection_media_mediaId_idx" ON "collection_media"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_media_collectionId_mediaId_key" ON "collection_media"("collectionId", "mediaId");

-- AddForeignKey
ALTER TABLE "collection_media" ADD CONSTRAINT "collection_media_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_media" ADD CONSTRAINT "collection_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
