-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'REJECTED', 'IN_REVIEW');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "status" "ArticleStatus" NOT NULL DEFAULT 'PUBLISHED';
