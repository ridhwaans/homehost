-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spotify_id" TEXT,
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
CREATE UNIQUE INDEX "Song.spotify_id_unique" ON "Song"("spotify_id");
CREATE UNIQUE INDEX "Song.fs_path_unique" ON "Song"("fs_path");
CREATE UNIQUE INDEX "Song.url_path_unique" ON "Song"("url_path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
