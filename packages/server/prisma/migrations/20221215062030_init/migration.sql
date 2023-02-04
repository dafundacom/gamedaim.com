/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");
