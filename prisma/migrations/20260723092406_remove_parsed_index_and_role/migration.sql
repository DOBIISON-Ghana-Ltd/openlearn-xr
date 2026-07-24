/*
  Warnings:

  - You are about to drop the column `parsedIndex` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `collection_media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collection" DROP COLUMN "parsedIndex";

-- AlterTable
ALTER TABLE "collection_media" DROP COLUMN "role";
