/*
  Warnings:

  - Added the required column `type` to the `NotAvailable` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NotAvailable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fs_path" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_NotAvailable" ("fs_path", "id") SELECT "fs_path", "id" FROM "NotAvailable";
DROP TABLE "NotAvailable";
ALTER TABLE "new_NotAvailable" RENAME TO "NotAvailable";
CREATE UNIQUE INDEX "NotAvailable.fs_path_unique" ON "NotAvailable"("fs_path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
