/*
  Warnings:

  - You are about to drop the `TransctionCounter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TransctionCounter";

-- CreateTable
CREATE TABLE "TransactionCounter" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "transactions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionCounter_id_key" ON "TransactionCounter"("id");
