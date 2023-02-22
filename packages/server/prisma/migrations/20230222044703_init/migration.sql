-- CreateTable
CREATE TABLE "_GameFilesToGame" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameFilesToGame_AB_unique" ON "_GameFilesToGame"("A", "B");

-- CreateIndex
CREATE INDEX "_GameFilesToGame_B_index" ON "_GameFilesToGame"("B");

-- AddForeignKey
ALTER TABLE "_GameFilesToGame" ADD CONSTRAINT "_GameFilesToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameFilesToGame" ADD CONSTRAINT "_GameFilesToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "GameFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
