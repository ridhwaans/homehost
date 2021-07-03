-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Similar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "backdrop_path" TEXT,
    "title" TEXT,
    "name" TEXT,
    "release_date" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Similar" ("backdrop_path", "id", "movie_tmdb_id", "name", "overview", "release_date", "show_tmdb_id", "title", "tmdb_id") SELECT "backdrop_path", "id", "movie_tmdb_id", "name", "overview", "release_date", "show_tmdb_id", "title", "tmdb_id" FROM "Similar";
DROP TABLE "Similar";
ALTER TABLE "new_Similar" RENAME TO "Similar";
CREATE UNIQUE INDEX "Similar.tmdb_id_unique" ON "Similar"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
