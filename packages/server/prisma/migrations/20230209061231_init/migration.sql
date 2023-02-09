-- CreateEnum
CREATE TYPE "AdPosition" AS ENUM ('ABOVE_POST', 'INLINE_POST', 'BELOW_POST', 'POP_UP');

-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "position" "AdPosition" NOT NULL DEFAULT 'ABOVE_POST',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ad_id_key" ON "Ad"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ad_title_key" ON "Ad"("title");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
