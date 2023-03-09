-- CreateTable
CREATE TABLE "WpView" (
    "id" TEXT NOT NULL,
    "wpPostId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WpView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WpView_id_key" ON "WpView"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WpView_wpPostId_key" ON "WpView"("wpPostId");
