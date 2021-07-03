/*
  Warnings:

  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `albumId` on the `Song` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Song` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Album` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Artist` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `album_spotify_id` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotify_id` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotify_id` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotify_id` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_AlbumToArtist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "disc_number" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "preview_url" TEXT NOT NULL,
    "track_number" INTEGER NOT NULL,
    "album_spotify_id" TEXT NOT NULL,
    FOREIGN KEY ("album_spotify_id") REFERENCES "Album" ("spotify_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("ctime", "disc_number", "duration_ms", "explicit", "fs_path", "id", "mtime", "name", "preview_url", "track_number", "type", "url_path") SELECT "ctime", "disc_number", "duration_ms", "explicit", "fs_path", "id", "mtime", "name", "preview_url", "track_number", "type", "url_path" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song.spotify_id_unique" ON "Song"("spotify_id");
CREATE UNIQUE INDEX "Song.fs_path_unique" ON "Song"("fs_path");
CREATE UNIQUE INDEX "Song.url_path_unique" ON "Song"("url_path");
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "album_type" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "release_date" TEXT NOT NULL
);
INSERT INTO "new_Album" ("album_type", "id", "images", "label", "name", "popularity", "release_date", "type") SELECT "album_type", "id", "images", "label", "name", "popularity", "release_date", "type" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE UNIQUE INDEX "Album.spotify_id_unique" ON "Album"("spotify_id");
CREATE TABLE "new_Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "albumId" TEXT NOT NULL
);
INSERT INTO "new_Artist" ("albumId", "id", "images", "name", "popularity", "type") SELECT "albumId", "id", "images", "name", "popularity", "type" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
CREATE UNIQUE INDEX "Artist.spotify_id_unique" ON "Artist"("spotify_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToArtist_AB_unique" ON "_AlbumToArtist"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToArtist_B_index" ON "_AlbumToArtist"("B");
