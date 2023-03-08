/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `TransactionCounter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TransactionCounter_sku_key" ON "TransactionCounter"("sku");
