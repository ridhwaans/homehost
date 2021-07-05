/*
  Warnings:

  - You are about to drop the column `movie_tmdb_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `show_tmdb_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `movie_tmdb_id` on the `Similar` table. All the data in the column will be lost.
  - You are about to drop the column `show_tmdb_id` on the `Similar` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movie_id" INTEGER,
    "show_id" INTEGER,
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
    FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit.tmdb_id_unique" ON "Credit"("tmdb_id");
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
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
    FOREIGN KEY ("season_tmdb_id") REFERENCES "Season" ("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("air_date", "ctime", "episode_number", "fs_path", "id", "mtime", "name", "overview", "season_number", "season_tmdb_id", "still_path", "tmdb_id", "type", "url_path", "vote_average", "vote_count") SELECT "air_date", "ctime", "episode_number", "fs_path", "id", "mtime", "name", "overview", "season_number", "season_tmdb_id", "still_path", "tmdb_id", "type", "url_path", "vote_average", "vote_count" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
CREATE UNIQUE INDEX "Episode.tmdb_id_unique" ON "Episode"("tmdb_id");
CREATE UNIQUE INDEX "Episode.fs_path_unique" ON "Episode"("fs_path");
CREATE UNIQUE INDEX "Episode.url_path_unique" ON "Episode"("url_path");
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spotify_id" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "disc_number" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "preview_url" TEXT,
    "track_number" INTEGER NOT NULL,
    "album_spotify_id" TEXT NOT NULL,
    FOREIGN KEY ("album_spotify_id") REFERENCES "Album" ("spotify_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("album_spotify_id", "ctime", "disc_number", "duration_ms", "explicit", "fs_path", "id", "mtime", "name", "preview_url", "spotify_id", "track_number", "url_path") SELECT "album_spotify_id", "ctime", "disc_number", "duration_ms", "explicit", "fs_path", "id", "mtime", "name", "preview_url", "spotify_id", "track_number", "url_path" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song.spotify_id_unique" ON "Song"("spotify_id");
CREATE UNIQUE INDEX "Song.fs_path_unique" ON "Song"("fs_path");
CREATE UNIQUE INDEX "Song.url_path_unique" ON "Song"("url_path");
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "air_date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "show_tmdb_id" INTEGER NOT NULL,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Season" ("air_date", "id", "name", "overview", "poster_path", "season_number", "show_tmdb_id", "tmdb_id") SELECT "air_date", "id", "name", "overview", "poster_path", "season_number", "show_tmdb_id", "tmdb_id" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
CREATE UNIQUE INDEX "Season.tmdb_id_unique" ON "Season"("tmdb_id");
CREATE TABLE "new_Similar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movie_id" INTEGER,
    "show_id" INTEGER,
    "tmdb_id" INTEGER NOT NULL,
    "title" TEXT,
    "name" TEXT,
    "release_date" TEXT,
    "first_air_date" TEXT,
    "overview" TEXT NOT NULL,
    "backdrop_path" TEXT,
    "poster_path" TEXT,
    FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Similar" ("backdrop_path", "first_air_date", "id", "name", "overview", "poster_path", "release_date", "title", "tmdb_id") SELECT "backdrop_path", "first_air_date", "id", "name", "overview", "poster_path", "release_date", "title", "tmdb_id" FROM "Similar";
DROP TABLE "Similar";
ALTER TABLE "new_Similar" RENAME TO "Similar";
CREATE UNIQUE INDEX "Similar.tmdb_id_unique" ON "Similar"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
