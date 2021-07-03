/*
  Warnings:

  - Made the column `spotify_id` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `spotify_id` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `spotify_id` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Song.spotify_id_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "album_type" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER,
    "release_date" TEXT NOT NULL
);
INSERT INTO "new_Album" ("album_type", "id", "images", "label", "name", "popularity", "release_date", "spotify_id", "type") SELECT "album_type", "id", "images", "label", "name", "popularity", "release_date", "spotify_id", "type" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE UNIQUE INDEX "Album.spotify_id_unique" ON "Album"("spotify_id");
CREATE TABLE "new_Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "popularity" INTEGER
);
INSERT INTO "new_Artist" ("id", "images", "name", "popularity", "spotify_id", "type") SELECT "id", "images", "name", "popularity", "spotify_id", "type" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
CREATE UNIQUE INDEX "Artist.spotify_id_unique" ON "Artist"("spotify_id");
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
    FOREIGN KEY ("album_spotify_id") REFERENCES "Album" ("spotify_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("album_spotify_id", "ctime", "disc_number", "duration_ms", "explicit", "fs_path", "id", "mtime", "name", "preview_url", "spotify_id", "track_number", "url_path") SELECT "album_spotify_id", "ctime", "disc_number", "duration_ms", "explicit", "fs_path", "id", "mtime", "name", "preview_url", "spotify_id", "track_number", "url_path" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song.fs_path_unique" ON "Song"("fs_path");
CREATE UNIQUE INDEX "Song.url_path_unique" ON "Song"("url_path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
