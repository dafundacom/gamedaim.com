/*
  Warnings:

  - The values [ABOVE_POST,INLINE_POST,BELOW_POST,POP_UP] on the enum `AdPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdPosition_new" AS ENUM ('HOME_BELOW_HEADER', 'TOPIC_BELOW_HEADER', 'ARTICLE_BELOW_HEADER', 'DOWNLOAD_BELOW_HEADER', 'SINGLE_ARTICLE_ABOVE_POST', 'SINGLE_ARTICLE_INLINE_POST', 'SINGLE_ARTICLE_BELOW_POST', 'SINGLE_ARTICLE_POP_UP', 'DOWNLOADING_PAGE');
ALTER TABLE "Ad" ALTER COLUMN "position" DROP DEFAULT;
ALTER TABLE "Ad" ALTER COLUMN "position" TYPE "AdPosition_new" USING ("position"::text::"AdPosition_new");
ALTER TYPE "AdPosition" RENAME TO "AdPosition_old";
ALTER TYPE "AdPosition_new" RENAME TO "AdPosition";
DROP TYPE "AdPosition_old";
ALTER TABLE "Ad" ALTER COLUMN "position" SET DEFAULT 'HOME_BELOW_HEADER';
COMMIT;

-- AlterTable
ALTER TABLE "Ad" ALTER COLUMN "position" SET DEFAULT 'HOME_BELOW_HEADER';
