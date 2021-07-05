/*
  Warnings:

  - A unique constraint covering the columns `[movie_id]` on the table `Credit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[show_id]` on the table `Credit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movie_id]` on the table `Similar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[show_id]` on the table `Similar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Credit.movie_id_unique" ON "Credit"("movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "Credit.show_id_unique" ON "Credit"("show_id");

-- CreateIndex
CREATE UNIQUE INDEX "Similar.movie_id_unique" ON "Similar"("movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "Similar.show_id_unique" ON "Similar"("show_id");
