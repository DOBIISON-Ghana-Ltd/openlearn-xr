/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubId` on the `subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "subscription_organizationId_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubId",
ADD COLUMN     "paystackCustomerCode" TEXT,
ADD COLUMN     "paystackSubCode" TEXT,
ADD COLUMN     "transactionId" TEXT;

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "reference" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "channel" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_reference_key" ON "transaction"("reference");

-- CreateIndex
CREATE INDEX "transaction_organizationId_idx" ON "transaction"("organizationId");

-- CreateIndex
CREATE INDEX "transaction_userId_idx" ON "transaction"("userId");

-- CreateIndex
CREATE INDEX "transaction_reference_idx" ON "transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_transactionId_key" ON "subscription"("transactionId");

-- CreateIndex
CREATE INDEX "subscription_organizationId_idx" ON "subscription"("organizationId");

-- CreateIndex
CREATE INDEX "subscription_status_idx" ON "subscription"("status");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
