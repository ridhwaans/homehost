/*
  Warnings:

  - You are about to drop the `_CreditToMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_created_by` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_credits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_CreditToMovie_B_index";

-- DropIndex
DROP INDEX "_CreditToMovie_AB_unique";

-- DropIndex
DROP INDEX "_created_by_B_index";

-- DropIndex
DROP INDEX "_created_by_AB_unique";

-- DropIndex
DROP INDEX "_credits_B_index";

-- DropIndex
DROP INDEX "_credits_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CreditToMovie";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_created_by";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_credits";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Similar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "title" TEXT,
    "name" TEXT,
    "release_date" TEXT,
    "first_air_date" TEXT,
    "overview" TEXT NOT NULL,
    "backdrop_path" TEXT,
    "poster_path" TEXT,
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Similar" ("backdrop_path", "first_air_date", "id", "movie_tmdb_id", "name", "overview", "poster_path", "release_date", "show_tmdb_id", "title", "tmdb_id") SELECT "backdrop_path", "first_air_date", "id", "movie_tmdb_id", "name", "overview", "poster_path", "release_date", "show_tmdb_id", "title", "tmdb_id" FROM "Similar";
DROP TABLE "Similar";
ALTER TABLE "new_Similar" RENAME TO "Similar";
CREATE UNIQUE INDEX "Similar.tmdb_id_unique" ON "Similar"("tmdb_id");
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "movie_tmdb_id" INTEGER,
    "show_tmdb_id" INTEGER,
    FOREIGN KEY ("movie_tmdb_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_tmdb_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit.tmdb_id_unique" ON "Credit"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
