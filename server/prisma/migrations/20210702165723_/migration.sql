/*
  Warnings:

  - A unique constraint covering the columns `[tmdb_id]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmdb_id]` on the table `ProductionCompany` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Genre.tmdb_id_unique" ON "Genre"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCompany.tmdb_id_unique" ON "ProductionCompany"("tmdb_id");
