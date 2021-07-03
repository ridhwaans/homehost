/*
  Warnings:

  - A unique constraint covering the columns `[tmdb_id]` on the table `Credit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Credit.tmdb_id_unique" ON "Credit"("tmdb_id");
