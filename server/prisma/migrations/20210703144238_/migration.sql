-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT,
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
    "spotify_id" TEXT,
    "name" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "popularity" INTEGER
);
INSERT INTO "new_Artist" ("id", "images", "name", "popularity", "spotify_id", "type") SELECT "id", "images", "name", "popularity", "spotify_id", "type" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
CREATE UNIQUE INDEX "Artist.spotify_id_unique" ON "Artist"("spotify_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
