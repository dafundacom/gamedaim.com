-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AdPosition" ADD VALUE 'SINGLE_DOWNLOAD_ABOVE';
ALTER TYPE "AdPosition" ADD VALUE 'SINGLE_DOWNLOAD_INLINE';
ALTER TYPE "AdPosition" ADD VALUE 'SINGLE_DOWNLOAD_BELOW';
ALTER TYPE "AdPosition" ADD VALUE 'SINGLE_DOWNLOAD_POP_UP';
