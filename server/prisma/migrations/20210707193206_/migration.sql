/*
  Warnings:

  - You are about to drop the column `cast_id` on the `Credit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "unique_tv_show_crew_id";

-- DropIndex
DROP INDEX "unique_tv_show_cast_id";

-- DropIndex
DROP INDEX "unique_movie_crew_id";

-- DropIndex
DROP INDEX "unique_movie_cast_id";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movie_tmdb_id" INTEGER,
    "tv_show_tmdb_id" INTEGER,
    "tmdb_id" INTEGER NOT NULL,
    "adult" BOOLEAN,
    "gender" INTEGER NOT NULL,
    "known_for_department" TEXT,
    "name" TEXT NOT NULL,
    "popularity" REAL,
    "profile_path" TEXT,
    "character" TEXT,
    "credit_id" TEXT NOT NULL,
    "order" INTEGER,
    "department" TEXT,
    "job" TEXT,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("tv_show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("adult", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "movie_tmdb_id", "name", "order", "popularity", "profile_path", "tmdb_id", "tv_show_tmdb_id") SELECT "adult", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "movie_tmdb_id", "name", "order", "popularity", "profile_path", "tmdb_id", "tv_show_tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit.credit_id_unique" ON "Credit"("credit_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
