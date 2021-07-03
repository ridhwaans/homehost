-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "job" TEXT
);
INSERT INTO "new_Credit" ("adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id") SELECT "adult", "cast_id", "character", "credit_id", "department", "gender", "id", "job", "known_for_department", "name", "order", "popularity", "profile_path", "tmdb_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit.tmdb_id_unique" ON "Credit"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
