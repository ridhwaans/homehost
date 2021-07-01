-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "imdb_id" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "poster_path" TEXT NOT NULL,
    "release_date" TEXT NOT NULL,
    "revenue" INTEGER NOT NULL,
    "runtime" INTEGER NOT NULL,
    "tagline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "movie_id" INTEGER,
    "show_id" INTEGER,
    FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionCompany" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logo_path" TEXT,
    "name" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "movie_id" INTEGER,
    "show_id" INTEGER,
    FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "job" TEXT,
    "movie_id" INTEGER,
    "show_id" INTEGER,
    FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "Episode" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "Episode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Similar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "backdrop_path" TEXT NOT NULL,
    "title" TEXT,
    "name" TEXT,
    "release_date" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "movie_id" INTEGER,
    "show_id" INTEGER,
    FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TVShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "poster_path" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "imdb_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "air_date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,
    FOREIGN KEY ("show_id") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "air_date" TEXT NOT NULL,
    "episode_number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "still_path" TEXT NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "album_type" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "release_date" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "albumId" TEXT NOT NULL,
    FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "fs_path" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    "ctime" DATETIME NOT NULL,
    "mtime" DATETIME NOT NULL,
    "disc_number" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "preview_url" TEXT NOT NULL,
    "track_number" INTEGER NOT NULL,
    "albumId" TEXT NOT NULL,
    FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie.fs_path_unique" ON "Movie"("fs_path");

-- CreateIndex
CREATE UNIQUE INDEX "Genre.name_unique" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TVShow.fs_path_unique" ON "TVShow"("fs_path");

-- CreateIndex
CREATE UNIQUE INDEX "Episode.fs_path_unique" ON "Episode"("fs_path");

-- CreateIndex
CREATE UNIQUE INDEX "Song.fs_path_unique" ON "Song"("fs_path");
