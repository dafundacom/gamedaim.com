/*
  Warnings:

  - Added the required column `transactions` to the `TransctionCounter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransctionCounter" ADD COLUMN     "transactions" INTEGER NOT NULL;
