/*
  Warnings:

  - You are about to drop the column `authorId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_authorId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "featuredImageId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePicture",
ADD COLUMN     "profilePictureId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
