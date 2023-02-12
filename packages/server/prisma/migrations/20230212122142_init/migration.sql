/*
  Warnings:

  - You are about to drop the `_ArticleComments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `articleId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ArticleComments" DROP CONSTRAINT "_ArticleComments_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleComments" DROP CONSTRAINT "_ArticleComments_B_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "articleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ArticleComments";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
