/*
  Warnings:

  - You are about to drop the column `featuredImageId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImageId` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureId` on the `User` table. All the data in the column will be lost.
  - Added the required column `featuredImage` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_featuredImageId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_featuredImageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "featuredImageId",
ADD COLUMN     "featuredImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "featuredImageId",
ADD COLUMN     "featuredImage" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePictureId",
ADD COLUMN     "profilePicture" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
