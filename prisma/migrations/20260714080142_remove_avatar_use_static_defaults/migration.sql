/*
  Warnings:

  - You are about to drop the column `avatar` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "logo" SET DEFAULT 'org-01';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "avatar",
ALTER COLUMN "image" SET DEFAULT 'avatar-01';
