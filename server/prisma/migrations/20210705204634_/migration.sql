/*
  Warnings:

  - You are about to drop the column `movie_id` on the `Similar` table. All the data in the column will be lost.
  - You are about to drop the column `show_id` on the `Similar` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_MovieToSimilar" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Similar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SimilarToTVShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Similar" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Similar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "title" TEXT,
    "name" TEXT,
    "release_date" TEXT,
    "first_air_date" TEXT,
    "overview" TEXT NOT NULL,
    "backdrop_path" TEXT,
    "poster_path" TEXT
);
INSERT INTO "new_Similar" ("backdrop_path", "first_air_date", "id", "name", "overview", "poster_path", "release_date", "title", "tmdb_id") SELECT "backdrop_path", "first_air_date", "id", "name", "overview", "poster_path", "release_date", "title", "tmdb_id" FROM "Similar";
DROP TABLE "Similar";
ALTER TABLE "new_Similar" RENAME TO "Similar";
CREATE UNIQUE INDEX "Similar.tmdb_id_unique" ON "Similar"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToSimilar_AB_unique" ON "_MovieToSimilar"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToSimilar_B_index" ON "_MovieToSimilar"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SimilarToTVShow_AB_unique" ON "_SimilarToTVShow"("A", "B");

-- CreateIndex
CREATE INDEX "_SimilarToTVShow_B_index" ON "_SimilarToTVShow"("B");
