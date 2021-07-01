/*
  Warnings:

  - You are about to drop the column `movie_id` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `show_id` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `movie_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `show_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `show_id` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `movie_id` on the `Similar` table. All the data in the column will be lost.
  - You are about to drop the column `show_id` on the `Similar` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `movie_id` on the `ProductionCompany` table. All the data in the column will be lost.
  - You are about to drop the column `show_id` on the `ProductionCompany` table. All the data in the column will be lost.
  - Added the required column `tmdb_id` to the `Genre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdb_id` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_tmdb_id` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdb_id` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdb_id` to the `Similar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdb_id` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `season_tmdb_id` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdb_id` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdb_id` to the `ProductionCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdb_id` to the `TVShow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Genre" ("id", "name") SELECT "id", "name" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
CREATE UNIQUE INDEX "Genre.tmdb_id_unique" ON "Genre"("tmdb_id");
CREATE UNIQUE INDEX "Genre.name_unique" ON "Genre"("name");
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
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "Episode" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "Episode" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit.tmdb_id_unique" ON "Credit"("tmdb_id");
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "air_date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "show_tmdb_id" INTEGER NOT NULL,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Season" ("air_date", "id", "name", "overview", "poster_path", "season_number", "type") SELECT "air_date", "id", "name", "overview", "poster_path", "season_number", "type" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
CREATE UNIQUE INDEX "Season.tmdb_id_unique" ON "Season"("tmdb_id");
CREATE TABLE "new_Similar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "title" TEXT,
    "name" TEXT,
    "release_date" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Similar" ("backdrop_path", "id", "name", "overview", "release_date", "title") SELECT "backdrop_path", "id", "name", "overview", "release_date", "title" FROM "Similar";
DROP TABLE "Similar";
ALTER TABLE "new_Similar" RENAME TO "Similar";
CREATE UNIQUE INDEX "Similar.tmdb_id_unique" ON "Similar"("tmdb_id");
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "imdb_id" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "poster_path" TEXT NOT NULL,
    "release_date" TEXT NOT NULL,
    "revenue" INTEGER NOT NULL,
    "runtime" INTEGER NOT NULL,
    "tagline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL
);
INSERT INTO "new_Movie" ("adult", "backdrop_path", "budget", "ctime", "fs_path", "id", "imdb_id", "mtime", "overview", "popularity", "poster_path", "release_date", "revenue", "runtime", "tagline", "title", "type", "url_path", "vote_average", "vote_count") SELECT "adult", "backdrop_path", "budget", "ctime", "fs_path", "id", "imdb_id", "mtime", "overview", "popularity", "poster_path", "release_date", "revenue", "runtime", "tagline", "title", "type", "url_path", "vote_average", "vote_count" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie.tmdb_id_unique" ON "Movie"("tmdb_id");
CREATE UNIQUE INDEX "Movie.fs_path_unique" ON "Movie"("fs_path");
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "air_date" TEXT NOT NULL,
    "episode_number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "still_path" TEXT NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "season_tmdb_id" INTEGER NOT NULL,
    FOREIGN KEY ("season_tmdb_id") REFERENCES "Season" ("tmdb_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("air_date", "ctime", "episode_number", "fs_path", "id", "mtime", "name", "overview", "season_number", "still_path", "type", "url_path", "vote_average", "vote_count") SELECT "air_date", "ctime", "episode_number", "fs_path", "id", "mtime", "name", "overview", "season_number", "still_path", "type", "url_path", "vote_average", "vote_count" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
CREATE UNIQUE INDEX "Episode.tmdb_id_unique" ON "Episode"("tmdb_id");
CREATE UNIQUE INDEX "Episode.fs_path_unique" ON "Episode"("fs_path");
CREATE TABLE "new_ProductionCompany" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "logo_path" TEXT,
    "name" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductionCompany" ("id", "logo_path", "name", "origin_country") SELECT "id", "logo_path", "name", "origin_country" FROM "ProductionCompany";
DROP TABLE "ProductionCompany";
ALTER TABLE "new_ProductionCompany" RENAME TO "ProductionCompany";
CREATE UNIQUE INDEX "ProductionCompany.tmdb_id_unique" ON "ProductionCompany"("tmdb_id");
CREATE TABLE "new_TVShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
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
INSERT INTO "new_TVShow" ("backdrop_path", "ctime", "fs_path", "id", "imdb_id", "mtime", "name", "overview", "popularity", "poster_path", "tagline", "type", "url_path", "vote_average", "vote_count") SELECT "backdrop_path", "ctime", "fs_path", "id", "imdb_id", "mtime", "name", "overview", "popularity", "poster_path", "tagline", "type", "url_path", "vote_average", "vote_count" FROM "TVShow";
DROP TABLE "TVShow";
ALTER TABLE "new_TVShow" RENAME TO "TVShow";
CREATE UNIQUE INDEX "TVShow.tmdb_id_unique" ON "TVShow"("tmdb_id");
CREATE UNIQUE INDEX "TVShow.fs_path_unique" ON "TVShow"("fs_path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
