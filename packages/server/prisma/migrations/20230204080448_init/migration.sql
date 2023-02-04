-- CreateTable
CREATE TABLE "CommentWp" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wpPostId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentWp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentWp_id_key" ON "CommentWp"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentWp_wpPostId_key" ON "CommentWp"("wpPostId");

-- AddForeignKey
ALTER TABLE "CommentWp" ADD CONSTRAINT "CommentWp_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
