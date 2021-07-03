/*
  Warnings:

  - Added the required column `total_tracks` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "album_type" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER,
    "release_date" TEXT NOT NULL,
    "total_tracks" INTEGER NOT NULL
);
INSERT INTO "new_Album" ("album_type", "id", "image_url", "label", "name", "popularity", "release_date", "spotify_id", "type") SELECT "album_type", "id", "image_url", "label", "name", "popularity", "release_date", "spotify_id", "type" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE UNIQUE INDEX "Album.spotify_id_unique" ON "Album"("spotify_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
