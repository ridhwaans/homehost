/*
  Warnings:

  - You are about to drop the column `movie_tmdb_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `show_tmdb_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `movie_tmdb_id` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `show_tmdb_id` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `movie_tmdb_id` on the `ProductionCompany` table. All the data in the column will be lost.
  - You are about to drop the column `show_tmdb_id` on the `ProductionCompany` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_GenreToMovie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MovieToProductionCompany" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "ProductionCompany" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CreditToMovie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Credit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GenreToTVShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProductionCompanyToTVShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "ProductionCompany" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_created_by" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Credit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_credits" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Credit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "gender" INTEGER NOT NULL,
    "known_for_department" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "profile_path" TEXT,
    "cast_id" INTEGER,
    "character" TEXT,
    "credit_id" TEXT NOT NULL,
    "order" INTEGER,
    "department" TEXT,
    "job" TEXT
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit.tmdb_id_unique" ON "Credit"("tmdb_id");
CREATE TABLE "new_Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Genre" ("id", "name", "tmdb_id") SELECT "id", "name", "tmdb_id" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
CREATE UNIQUE INDEX "Genre.tmdb_id_unique" ON "Genre"("tmdb_id");
CREATE TABLE "new_ProductionCompany" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "logo_path" TEXT,
    "name" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL
);
INSERT INTO "new_ProductionCompany" ("id", "logo_path", "name", "origin_country", "tmdb_id") SELECT "id", "logo_path", "name", "origin_country", "tmdb_id" FROM "ProductionCompany";
DROP TABLE "ProductionCompany";
ALTER TABLE "new_ProductionCompany" RENAME TO "ProductionCompany";
CREATE UNIQUE INDEX "ProductionCompany.tmdb_id_unique" ON "ProductionCompany"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToMovie_AB_unique" ON "_GenreToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToMovie_B_index" ON "_GenreToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToProductionCompany_AB_unique" ON "_MovieToProductionCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToProductionCompany_B_index" ON "_MovieToProductionCompany"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CreditToMovie_AB_unique" ON "_CreditToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditToMovie_B_index" ON "_CreditToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToTVShow_AB_unique" ON "_GenreToTVShow"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToTVShow_B_index" ON "_GenreToTVShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductionCompanyToTVShow_AB_unique" ON "_ProductionCompanyToTVShow"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductionCompanyToTVShow_B_index" ON "_ProductionCompanyToTVShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_created_by_AB_unique" ON "_created_by"("A", "B");

-- CreateIndex
CREATE INDEX "_created_by_B_index" ON "_created_by"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_credits_AB_unique" ON "_credits"("A", "B");

-- CreateIndex
CREATE INDEX "_credits_B_index" ON "_credits"("B");
