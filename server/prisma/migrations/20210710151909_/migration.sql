/*
  Warnings:

  - A unique constraint covering the columns `[tv_show_tmdb_id,season_number]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Season.tv_show_tmdb_id_season_number_unique" ON "Season"("tv_show_tmdb_id", "season_number");
