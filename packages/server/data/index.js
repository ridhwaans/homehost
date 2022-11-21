const { shuffleArr, format } = require('../utils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const metadataServiceConstructor = require('../services/metadata');
const metadataService = new metadataServiceConstructor();

const getAbout = () => {
  return {
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  };
};

const getLibraryStats = async () => {
  return {
    movies: await prisma.movie.count(),
    tv_shows: await prisma.tVShow.count(),
    seasons: await prisma.season.count(),
    episodes: await prisma.episode.count(),
    artists: await prisma.artist.count(),
    albums: await prisma.album.count(),
    songs: await prisma.song.count(),
    not_available: await prisma.notAvailable.count(),
  };
};

const getAllNotAvailable = async () => {
  const result = await prisma.notAvailable.findMany();
  return result;
};

const externalSearch = async (type, keyword) => {
  return await metadataService.search(type, keyword);
};

const searchMoviesAndTV = async (keyword) => {
  const movies = await prisma.movie.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    where: {
      OR: [
        { title: { contains: keyword } },
        { tagline: { contains: keyword } },
        { overview: { contains: keyword } },
        {
          credits: {
            some: {
              name: { contains: keyword },
            },
          },
        },
      ],
    },
  });
  const tv_shows = await prisma.tVShow.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    where: {
      OR: [
        { name: { contains: keyword } },
        { tagline: { contains: keyword } },
        { overview: { contains: keyword } },
        {
          seasons: {
            some: {
              OR: [
                { name: { contains: keyword } },
                { overview: { contains: keyword } },
                {
                  episodes: {
                    some: {
                      OR: [
                        { name: { contains: keyword } },
                        { overview: { contains: keyword } },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          credits: {
            some: {
              name: { contains: keyword },
            },
          },
        },
      ],
    },
  });
  const results = shuffleArr(format([].concat(tv_shows).concat(movies)));
  return {
    results: results,
    count: results.length,
  };
};

const searchMusic = async (keyword) => {
  if (keyword.trim() == '') {
    return { results: { songs: [], artists: [], albums: [] } };
  }
  const songs = await prisma.song.findMany({
    include: { album: { include: { artists: true } } },
    where: {
      OR: [
        { name: { contains: keyword } },
        {
          album: {
            artists: {
              some: {
                name: { contains: keyword },
              },
            },
          },
        },
      ],
    },
  });
  const artists = await prisma.artist.findMany({
    where: {
      name: {
        contains: keyword,
      },
    },
  });
  const albums = await prisma.album.findMany({
    include: {
      artists: true,
      songs: { include: { album: { include: { artists: true } } } },
    },
    where: {
      OR: [
        { name: { contains: keyword } },
        {
          artists: {
            some: {
              name: { contains: keyword },
            },
          },
        },
      ],
    },
  });
  return {
    results: {
      songs: format(songs),
      artists: format(artists),
      albums: format(albums),
    },
  };
};

const getAllMovies = async () => {
  const result = await prisma.movie.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
  });
  return format(result);
};

const getMostPopularMovies = async () => {
  const result = await prisma.movie.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    orderBy: {
      popularity: 'desc',
    },
    take: 25,
  });
  return format(result);
};

const getHighestRatedMovies = async () => {
  const result = await prisma.movie.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    orderBy: {
      vote_average: 'desc',
    },
    take: 25,
  });
  return format(result);
};

const getRecentlyAddedMovies = async () => {
  const result = await prisma.movie.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    orderBy: {
      ctime: 'desc',
    },
    take: 25,
  });
  return format(result);
};

const getMovieGenres = async () => {
  const result = await prisma.genre.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return format(result);
};

const getMoviesByGenre = async (genre_name) => {
  const result = await prisma.movie.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    where: {
      genres: {
        some: {
          name: genre_name,
        },
      },
    },
  });
  return shuffleArr(format(result));
};

const getMovie = async (movie_id) => {
  const result = await prisma.movie.findUnique({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    where: {
      tmdb_id: parseInt(movie_id),
    },
  });
  return format(result);
};

const getAllTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
  });
  return format(result);
};

const getMostPopularTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    orderBy: {
      popularity: 'desc',
    },
    take: 25,
  });
  return format(result);
};

const getHighestRatedTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    orderBy: {
      vote_average: 'desc',
    },
    take: 25,
  });
  return format(result);
};

const lastAddedEpisode = (tv_show) => {
  return Math.max(
    ...tv_show.seasons.map((s) => s.episodes.map((e) => e.mtime)).flat(Infinity)
  );
};

const getRecentlyAddedTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
  });
  return format(
    result.sort((a, b) => lastAddedEpisode(b) - lastAddedEpisode(a))
  );
};

const getTVShowGenres = async () => {
  const result = await prisma.genre.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return format(result);
};

const getTVShowsByGenre = async (genre_name) => {
  const result = await prisma.tVShow.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    where: {
      genres: {
        some: {
          name: genre_name,
        },
      },
    },
  });
  return shuffleArr(format(result));
};

const getTVShow = async (tv_show_id) => {
  const result = await prisma.tVShow.findUnique({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    where: {
      tmdb_id: parseInt(tv_show_id),
    },
  });
  return format(result);
};

const getAllArtists = async () => {
  const result = await prisma.artist.findMany();
  return format(result);
};

const getMostPopularArtists = async () => {
  const result = await prisma.artist.findMany({
    orderBy: {
      popularity: 'desc',
    },
  });
  return format(result);
};

const getAllAlbums = async () => {
  const result = await prisma.album.findMany({
    include: {
      artists: true,
      songs: { include: { album: { include: { artists: true } } } },
    },
  });
  return format(result);
};

const lastAddedSong = (album) => {
  return Math.max(...album.songs.map((s) => s.mtime));
};

const getRecentlyAddedAlbums = async () => {
  const result = await prisma.album.findMany({
    include: {
      artists: true,
      songs: { include: { album: { include: { artists: true } } } },
    },
  });
  return format(result.sort((a, b) => lastAddedSong(b) - lastAddedSong(a)));
};

const getLatestAlbumReleases = async () => {
  const result = await prisma.album.findMany({
    include: {
      artists: true,
      songs: { include: { album: { include: { artists: true } } } },
    },
    orderBy: {
      release_date: 'desc',
    },
  });
  return format(result);
};

const getMusicAlbum = async (album_id) => {
  const result = await prisma.album.findUnique({
    include: { artists: true, songs: { include: { artists: true } } },
    where: {
      spotify_id: album_id,
    },
  });
  return format(result);
};

const getAllSongs = async () => {
  const result = await prisma.song.findMany({
    include: { album: { include: { artists: true } } },
  });
  return format(result);
};

const getRecentlyAddedSongs = async () => {
  const result = await prisma.song.findMany({
    include: { album: { include: { artists: true } } },
    orderBy: {
      mtime: 'desc',
    },
  });
  return format(result);
};

const getRandomMovieOrTVShow = async () => {
  const ratio = (await prisma.tVShow.count()) / (await prisma.movie.count());
  const result =
    (await Math.random()) < ratio
      ? await getRandomTVShow()
      : await getRandomMovie();
  return format(result);
};

const getRandomMovie = async () => {
  const id = Math.floor(Math.random() * (await prisma.movie.count())) + 1;
  const result = await prisma.movie.findUnique({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    where: {
      id: id,
    },
  });
  return format(result);
};

const getRandomTVShow = async () => {
  const id = Math.floor(Math.random() * (await prisma.tVShow.count())) + 1;
  const result = await prisma.tVShow.findUnique({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    where: {
      id: id,
    },
  });
  return format(result);
};

const getMovieFilePath = async (movie_id) => {
  const result = await prisma.movie.findUnique({
    select: {
      fs_path: true,
    },
    where: {
      tmdb_id: parseInt(movie_id),
    },
  });
  return result.fs_path;
};

const getEpisodeFilePath = async (
  tv_show_id,
  season_number,
  episode_number
) => {
  const result = await prisma.season.findUnique({
    select: {
      episodes: {
        where: {
          episode_number: parseInt(episode_number),
        },
        select: {
          fs_path: true,
        },
      },
    },
    where: {
      tv_show_tmdb_id_season_number: {
        tv_show_tmdb_id: parseInt(tv_show_id),
        season_number: parseInt(season_number),
      },
    },
  });
  return result.episodes[0].fs_path;
};

const getSongFilePath = async (album_id, disc_number, track_number) => {
  const result = await prisma.album.findUnique({
    select: {
      songs: {
        where: {
          disc_number: parseInt(disc_number),
          track_number: parseInt(track_number),
        },
        select: {
          fs_path: true,
        },
      },
    },
    where: {
      spotify_id: album_id,
    },
  });
  return result.songs[0].fs_path;
};

module.exports = {
  getAbout,
  getLibraryStats,
  getAllNotAvailable,
  getAllMovies,
  getMostPopularMovies,
  getHighestRatedMovies,
  getRecentlyAddedMovies,
  getMovieGenres,
  getMoviesByGenre,
  getRandomMovie,
  getMovie,
  getAllTVShows,
  getMostPopularTVShows,
  getHighestRatedTVShows,
  getRecentlyAddedTVShows,
  getTVShowGenres,
  getTVShowsByGenre,
  getRandomTVShow,
  getTVShow,
  getRandomMovieOrTVShow,
  getAllAlbums,
  getRecentlyAddedAlbums,
  getLatestAlbumReleases,
  getMusicAlbum,
  getAllArtists,
  getMostPopularArtists,
  getAllSongs,
  getRecentlyAddedSongs,
  getMovieFilePath,
  getSongFilePath,
  getEpisodeFilePath,
  searchMoviesAndTV,
  searchMusic,
  externalSearch,
};
