/*
  Warnings:

  - A unique constraint covering the columns `[movie_id,show_id,tmdb_id]` on the table `Credit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "composite_id" ON "Credit"("movie_id", "show_id", "tmdb_id");
