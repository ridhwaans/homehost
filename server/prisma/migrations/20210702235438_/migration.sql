-- RedefineTables
PRAGMA foreign_keys=OFF;
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
