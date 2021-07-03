/*
  Warnings:

  - You are about to drop the column `type` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `ctime` on the `TVShow` table. All the data in the column will be lost.
  - You are about to drop the column `fs_path` on the `TVShow` table. All the data in the column will be lost.
  - You are about to drop the column `mtime` on the `TVShow` table. All the data in the column will be lost.
  - You are about to drop the column `url_path` on the `TVShow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url_path]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url_path]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TVShow.fs_path_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "gender" INTEGER NOT NULL,
    "known_for_department" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "profile_path" TEXT,
    "cast_id" INTEGER,
    "character" TEXT,
    "credit_id" TEXT NOT NULL,
    "order" INTEGER,
    "department" TEXT,
    "job" TEXT,
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "movie_tmdb_id", "name", "order", "popularity", "profile_path", "show_tmdb_id", "tmdb_id") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "movie_tmdb_id", "name", "order", "popularity", "profile_path", "show_tmdb_id", "tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit.tmdb_id_unique" ON "Credit"("tmdb_id");
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "air_date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "show_tmdb_id" INTEGER NOT NULL,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Season" ("air_date", "id", "name", "overview", "poster_path", "season_number", "show_tmdb_id", "tmdb_id") SELECT "air_date", "id", "name", "overview", "poster_path", "season_number", "show_tmdb_id", "tmdb_id" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
CREATE UNIQUE INDEX "Season.tmdb_id_unique" ON "Season"("tmdb_id");
CREATE TABLE "new_TVShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "poster_path" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "imdb_id" TEXT NOT NULL
);
INSERT INTO "new_TVShow" ("backdrop_path", "id", "imdb_id", "name", "overview", "popularity", "poster_path", "tagline", "tmdb_id", "type", "vote_average", "vote_count") SELECT "backdrop_path", "id", "imdb_id", "name", "overview", "popularity", "poster_path", "tagline", "tmdb_id", "type", "vote_average", "vote_count" FROM "TVShow";
DROP TABLE "TVShow";
ALTER TABLE "new_TVShow" RENAME TO "TVShow";
CREATE UNIQUE INDEX "TVShow.tmdb_id_unique" ON "TVShow"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Episode.url_path_unique" ON "Episode"("url_path");

-- CreateIndex
CREATE UNIQUE INDEX "Movie.url_path_unique" ON "Movie"("url_path");
