-- CreateTable
CREATE TABLE "WpComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wpPostId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WpComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WpComment_id_key" ON "WpComment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WpComment_wpPostId_key" ON "WpComment"("wpPostId");

-- AddForeignKey
ALTER TABLE "WpComment" ADD CONSTRAINT "WpComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
