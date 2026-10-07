/*
  Warnings:

  - You are about to drop the column `seats` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paystackSubCode]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_transactionId_fkey";

-- DropIndex
DROP INDEX "subscription_transactionId_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "seats",
DROP COLUMN "transactionId",
ADD COLUMN     "paystackEmailToken" TEXT;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "accessCode" TEXT,
ADD COLUMN     "subscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_organizationId_key" ON "subscription"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_paystackSubCode_key" ON "subscription"("paystackSubCode");

-- CreateIndex
CREATE INDEX "subscription_paystackSubCode_idx" ON "subscription"("paystackSubCode");

-- CreateIndex
CREATE INDEX "transaction_subscriptionId_idx" ON "transaction"("subscriptionId");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
