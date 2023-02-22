/*
  Warnings:

  - The `status` column on the `Article` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `gameId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'REJECTED', 'IN_REVIEW');

-- CreateEnum
CREATE TYPE "DownloadSchema" AS ENUM ('GameApp', 'BusinessApp', 'MultimediaApp', 'MobileApp', 'WebApp', 'SocialNetworkingApp', 'TravelApp', 'ShoppingApp', 'SportsApp', 'LifeStyleApp', 'DesignApp', 'DeveloperApp', 'DriverApp', 'EducationalApp', 'HealthApp', 'FinanceApp', 'SecurityApp', 'BrowserApp', 'CommunicationApp', 'HomeApp', 'UtilitiesApp', 'RefereceApp');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "status",
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "gameId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ArticleStatus";

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "featuredImageId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "operationSystem" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "officialWeb" TEXT NOT NULL,
    "schemaType" "DownloadSchema" NOT NULL DEFAULT 'GameApp',
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameFile" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "featuredImageId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "downloadLink" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameTopics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GameFile_id_key" ON "GameFile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameFile_slug_key" ON "GameFile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_GameTopics_AB_unique" ON "_GameTopics"("A", "B");

-- CreateIndex
CREATE INDEX "_GameTopics_B_index" ON "_GameTopics"("B");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFile" ADD CONSTRAINT "GameFile_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameFile" ADD CONSTRAINT "GameFile_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameTopics" ADD CONSTRAINT "_GameTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameTopics" ADD CONSTRAINT "_GameTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
