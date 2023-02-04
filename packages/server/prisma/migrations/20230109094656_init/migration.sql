/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleToTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToTopic" DROP CONSTRAINT "_ArticleToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToTopic" DROP CONSTRAINT "_ArticleToTopic_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePicture",
ADD COLUMN     "profilePictureId" TEXT;

-- DropTable
DROP TABLE "_ArticleToTopic";

-- CreateTable
CREATE TABLE "_ArticleTopics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleTopics_AB_unique" ON "_ArticleTopics"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleTopics_B_index" ON "_ArticleTopics"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTopics" ADD CONSTRAINT "_ArticleTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTopics" ADD CONSTRAINT "_ArticleTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
