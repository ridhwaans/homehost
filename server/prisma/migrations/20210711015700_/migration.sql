-- CreateTable
CREATE TABLE "NotAvailable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fs_path" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
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
    "tagline" TEXT,
    "title" TEXT NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "logo_path" TEXT
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductionCompany" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "logo_path" TEXT,
    "name" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Credit" (
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

-- CreateTable
CREATE TABLE "Similar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "title" TEXT,
    "name" TEXT,
    "release_date" TEXT,
    "first_air_date" TEXT,
    "overview" TEXT NOT NULL,
    "backdrop_path" TEXT,
    "poster_path" TEXT
);

-- CreateTable
CREATE TABLE "TVShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "poster_path" TEXT NOT NULL,
    "tagline" TEXT,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "logo_path" TEXT,
    "imdb_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tv_show_tmdb_id" INTEGER NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "air_date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    FOREIGN KEY ("tv_show_tmdb_id") REFERENCES "TVShow" ("tmdb_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "season_tmdb_id" INTEGER NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
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
    FOREIGN KEY ("season_tmdb_id") REFERENCES "Season" ("tmdb_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "album_type" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER,
    "release_date" TEXT NOT NULL,
    "total_tracks" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "popularity" INTEGER
);

-- CreateTable
CREATE TABLE "Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "album_spotify_id" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
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
    FOREIGN KEY ("album_spotify_id") REFERENCES "Album" ("spotify_id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
CREATE TABLE "_MovieToSimilar" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Similar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE TABLE "_SimilarToTVShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Similar" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AlbumToArtist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "NotAvailable.fs_path_unique" ON "NotAvailable"("fs_path");

-- CreateIndex
CREATE UNIQUE INDEX "Movie.tmdb_id_unique" ON "Movie"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Movie.fs_path_unique" ON "Movie"("fs_path");

-- CreateIndex
CREATE UNIQUE INDEX "Movie.url_path_unique" ON "Movie"("url_path");

-- CreateIndex
CREATE UNIQUE INDEX "Genre.tmdb_id_unique" ON "Genre"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCompany.tmdb_id_unique" ON "ProductionCompany"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Credit.credit_id_unique" ON "Credit"("credit_id");

-- CreateIndex
CREATE UNIQUE INDEX "Similar.tmdb_id_unique" ON "Similar"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "TVShow.tmdb_id_unique" ON "TVShow"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Season.tmdb_id_unique" ON "Season"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Season.tv_show_tmdb_id_season_number_unique" ON "Season"("tv_show_tmdb_id", "season_number");

-- CreateIndex
CREATE UNIQUE INDEX "Episode.tmdb_id_unique" ON "Episode"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Episode.fs_path_unique" ON "Episode"("fs_path");

-- CreateIndex
CREATE UNIQUE INDEX "Episode.url_path_unique" ON "Episode"("url_path");

-- CreateIndex
CREATE UNIQUE INDEX "Album.spotify_id_unique" ON "Album"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "Artist.spotify_id_unique" ON "Artist"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "Song.spotify_id_unique" ON "Song"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "Song.fs_path_unique" ON "Song"("fs_path");

-- CreateIndex
CREATE UNIQUE INDEX "Song.url_path_unique" ON "Song"("url_path");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToMovie_AB_unique" ON "_GenreToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToMovie_B_index" ON "_GenreToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToProductionCompany_AB_unique" ON "_MovieToProductionCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToProductionCompany_B_index" ON "_MovieToProductionCompany"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToSimilar_AB_unique" ON "_MovieToSimilar"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToSimilar_B_index" ON "_MovieToSimilar"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToTVShow_AB_unique" ON "_GenreToTVShow"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToTVShow_B_index" ON "_GenreToTVShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductionCompanyToTVShow_AB_unique" ON "_ProductionCompanyToTVShow"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductionCompanyToTVShow_B_index" ON "_ProductionCompanyToTVShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SimilarToTVShow_AB_unique" ON "_SimilarToTVShow"("A", "B");

-- CreateIndex
CREATE INDEX "_SimilarToTVShow_B_index" ON "_SimilarToTVShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToArtist_AB_unique" ON "_AlbumToArtist"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToArtist_B_index" ON "_AlbumToArtist"("B");
