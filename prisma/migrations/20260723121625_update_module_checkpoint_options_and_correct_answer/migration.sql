/*
  Warnings:

  - The `options` column on the `module_checkpoint` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `correctAnswer` on the `module_checkpoint` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "module_checkpoint" DROP COLUMN "options",
ADD COLUMN     "options" TEXT[],
DROP COLUMN "correctAnswer",
ADD COLUMN     "correctAnswer" INTEGER NOT NULL;
