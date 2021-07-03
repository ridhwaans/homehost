/*
  Warnings:

  - You are about to drop the column `images` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Album` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "popularity" INTEGER
);
INSERT INTO "new_Artist" ("id", "name", "popularity", "spotify_id", "type") SELECT "id", "name", "popularity", "spotify_id", "type" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
CREATE UNIQUE INDEX "Artist.spotify_id_unique" ON "Artist"("spotify_id");
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "album_type" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER,
    "release_date" TEXT NOT NULL
);
INSERT INTO "new_Album" ("album_type", "id", "label", "name", "popularity", "release_date", "spotify_id", "type") SELECT "album_type", "id", "label", "name", "popularity", "release_date", "spotify_id", "type" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE UNIQUE INDEX "Album.spotify_id_unique" ON "Album"("spotify_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
