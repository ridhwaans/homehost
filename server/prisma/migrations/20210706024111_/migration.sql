/*
  Warnings:

  - You are about to drop the column `movie_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `show_id` on the `Credit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "unique_show_credit_id";

-- DropIndex
DROP INDEX "unique_movie_credit_id";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
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
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "unique_movie_credit_id" ON "Credit"("tmdb_id", "movie_tmdb_id", "known_for_department");
CREATE UNIQUE INDEX "unique_show_credit_id" ON "Credit"("tmdb_id", "show_tmdb_id", "known_for_department");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
