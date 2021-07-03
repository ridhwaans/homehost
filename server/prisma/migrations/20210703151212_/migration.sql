/*
  Warnings:

  - A unique constraint covering the columns `[spotify_id]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Song.spotify_id_unique" ON "Song"("spotify_id");
