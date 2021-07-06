/*
  Warnings:

  - You are about to drop the column `show_tmdb_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `show_tmdb_id` on the `Season` table. All the data in the column will be lost.
  - Added the required column `tv_show_tmdb_id` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "unique_show_credit_id";

-- DropIndex
DROP INDEX "unique_movie_credit_id";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movie_tmdb_id" INTEGER,
    "tv_show_tmdb_id" INTEGER,
    "tmdb_id" INTEGER NOT NULL,
    "adult" BOOLEAN,
    "gender" INTEGER NOT NULL,
    "known_for_department" TEXT,
    "name" TEXT NOT NULL,
    "popularity" REAL,
    "profile_path" TEXT,
    "cast_id" INTEGER,
    "character" TEXT,
    "credit_id" TEXT NOT NULL,
    "order" INTEGER,
    "department" TEXT,
    "job" TEXT,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("tv_show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "movie_tmdb_id", "name", "order", "popularity", "profile_path", "tmdb_id") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "movie_tmdb_id", "name", "order", "popularity", "profile_path", "tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "unique_movie_cast_id" ON "Credit"("movie_tmdb_id", "tmdb_id", "character");
CREATE UNIQUE INDEX "unique_movie_crew_id" ON "Credit"("movie_tmdb_id", "tmdb_id", "job");
CREATE UNIQUE INDEX "unique_tv_show_cast_id" ON "Credit"("tv_show_tmdb_id", "tmdb_id", "character");
CREATE UNIQUE INDEX "unique_tv_show_crew_id" ON "Credit"("tv_show_tmdb_id", "tmdb_id", "job");
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tv_show_tmdb_id" INTEGER NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "air_date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    FOREIGN KEY ("tv_show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Season" ("air_date", "id", "name", "overview", "poster_path", "season_number", "tmdb_id") SELECT "air_date", "id", "name", "overview", "poster_path", "season_number", "tmdb_id" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
CREATE UNIQUE INDEX "Season.tmdb_id_unique" ON "Season"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
