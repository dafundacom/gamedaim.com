/*
  Warnings:

  - You are about to drop the column `featuredImage` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImage` on the `Topic` table. All the data in the column will be lost.
  - Added the required column `featuredImageId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "featuredImage",
ADD COLUMN     "featuredImageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "featuredImage",
ADD COLUMN     "featuredImageId" TEXT;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
