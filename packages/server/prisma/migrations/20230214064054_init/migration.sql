/*
  Warnings:

  - You are about to drop the `WpComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WpComment" DROP CONSTRAINT "WpComment_authorId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_title" TEXT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_title" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_title" TEXT;

-- DropTable
DROP TABLE "WpComment";
