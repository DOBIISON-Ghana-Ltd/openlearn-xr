/*
  Warnings:

  - You are about to drop the column `level` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `publishedVersionId` on the `module` table. All the data in the column will be lost.
  - You are about to drop the column `anonymousName` on the `session_player` table. All the data in the column will be lost.
  - Added the required column `grade` to the `collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `explanation` to the `module_checkpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hint` to the `module_checkpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `session_player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "module" DROP CONSTRAINT "module_publishedVersionId_fkey";

-- DropIndex
DROP INDEX "module_publishedVersionId_key";

-- AlterTable
ALTER TABLE "collection" DROP COLUMN "level",
ADD COLUMN     "grade" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "module" DROP COLUMN "publishedVersionId",
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "module_checkpoint" ADD COLUMN     "explanation" TEXT NOT NULL,
ADD COLUMN     "hint" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "session_player" DROP COLUMN "anonymousName",
ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT 'avatar-01',
ADD COLUMN     "name" TEXT NOT NULL;
