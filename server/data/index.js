const { shuffleArr } = require('../utils');
const { getAll } = require('../jobs');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

var database;

const multiPropsFilterMovies = (movie, keyword) => {
  return (movie.title.match(new RegExp(keyword, 'i')) != null ||
    movie.tagline.match(new RegExp(keyword, 'i')) != null ||
    movie.overview.match(new RegExp(keyword, 'i')) != null
    ) || (
    movie.credits.cast.some(x => x.name.match(new RegExp(keyword, 'i')) != null)
    ) || (
    movie.credits.crew.find(x => x.job === "Director").name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterTV = (tv, keyword) => {
  return (tv.name.match(new RegExp(keyword, 'i')) != null ||
    tv.tagline.match(new RegExp(keyword, 'i')) != null ||
    tv.overview.match(new RegExp(keyword, 'i')) != null
    ) || (
    tv.seasons.some(x => x.name.match(new RegExp(keyword, 'i')) || x.overview.match(new RegExp(keyword, 'i')) != null)
    ) || (
    tv.seasons.some(x => x.episodes.some(ep => ep.name.match(new RegExp(keyword, 'i')) || ep.overview.match(new RegExp(keyword, 'i')) != null))
    ) || (
    tv.credits.cast.some(x => x.name.match(new RegExp(keyword, 'i')) != null))
}
  
const multiPropsFilterMusicSongs = async (keyword) => {
  database = database || await getAll()
  return database.music.map(album => album.songs
    .map(song => {song.album_name = album.name; song.album_image_url = album.image_url; song.artists = album.artists; return song}))
    .flat(Infinity)
    .filter(song => song.url_path != null)
    .filter(song => song.name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterMusicArtists = async (keyword) => {
  database = database || await getAll()
  let artists = [...new Map(database.music.map(music => music.artists).flat(Infinity).map(item => [item.id, item])).values()];
  return artists.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterMusicAlbums = async (keyword) => {
  database = database || await getAll()
  return database.music.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}

const searchMoviesAndTV = async (keyword) => {
  database = database || await getAll()
  let search_results = {};
  search_results.results = database.tv.filter(tv => multiPropsFilterTV(tv, keyword))
    .concat(database.movies.filter(movie => multiPropsFilterMovies(movie, keyword)));
    search_results.count = search_results.results.length

  return search_results
}

const searchMusic = async (keyword) => {
  database = database || await getAll()
  let search_results = {results: {songs:[], artists: [], albums: []}, song_count: 0, artist_count: 0, album_count: 0, total_count: 0};
  if (keyword.trim() == "") {
    return search_results;
  }
  search_results.results.songs = await multiPropsFilterMusicSongs(keyword);
  search_results.results.artists = await multiPropsFilterMusicArtists(keyword);
  search_results.results.albums = await multiPropsFilterMusicAlbums(keyword);
  search_results.song_count = search_results.results.songs.length
  search_results.artist_count = search_results.results.artists.length
  search_results.album_count = search_results.results.albums.length
  search_results.total_count = Object.values(search_results.results).reduce((acc, group) => acc + group.length, 0)

  return search_results
}

const getAbout = () => {
  const result = {homehost: 'hello world', environment: process.env.NODE_ENV};
  return result
}

const getAllMovies = async () => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true }
  })
  return result
}

const getMostPopularMovies = async () => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    orderBy: {
      popularity: "desc"
      },
    take: 25
  })
  return result
}

const getHighestRatedMovies = async () => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    orderBy: {
      vote_average: "desc"
      },
    take: 25
  })
  return result
}

const getRecentlyAddedMovies = async () => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    orderBy: {
      mtime: "desc"
    },
    take: 25
  })
  return result
}

const getMovieGenres = async () => {
  const result = await prisma.genre.findMany({
    orderBy: {
      name: "asc"
    }
  })
  return result
}

const getMoviesByGenre = async (genre_name) => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    where: {
      genres: {
        some: {
          name: genre_name
        }
      }
    }
  })
  return shuffleArr(result)
}

const getMovie = async (movie_id) => {
  const result = await prisma.movie.findUnique({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    where: {
      tmdb_id: parseInt(movie_id)
    }
  })
  return result
}

const getAllTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true }
  })
  return result
}

const getMostPopularTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    orderBy: {
      popularity: "desc"
      },
    take: 25
  })
  return result
}

const getHighestRatedTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    orderBy: {
      vote_average: "desc"
      },
    take: 25
  })
  return result
}

const getRecentlyAddedTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    orderBy: {
      seasons: {
        _max: {
          episodes: {
              mtime: true
          }
        }
      }
    },
    take: 25
  })
  return result
}

const getTVShowGenres = async () => {
  const result = await prisma.genre.findMany({
    orderBy: {
      name: "asc"
    }
  })
  return result
}

const getTVShowsByGenre = async (genre_name) => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    where: {
      genres: {
        some: {
          name: genre_name
        }
      }
    }
  })
  return shuffleArr(result)
}

const getTVShow = async (tv_show_id) => {
  const result = await prisma.tVShow.findUnique({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    where: {
      tmdb_id: parseInt(tv_show_id)
    }
  })
  return result
}

const getRecentlyAddedMusic = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true },
    orderBy: {
      songs: {
        _max: {
          mtime: true
        }
      }
    },
    take: 25
  })
  return result
}

const getAllArtists = async () => {
  const result = await prisma.artist.findMany()
  return result
}

const getAllAlbums = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true }
  })
  return result
}

const getMusicAlbum = async (album_id) => {
  const result = await prisma.album.findUnique({
    include: { artists: true, songs: true },
    where: {
      spotify_id: album_id
    }
  })
  return result
}

const getAllSongs = async () => {
  const result = await prisma.song.findMany({
    include: { album: { include: { artists: true } } }
  })
  const songs = result.map(song => {
      song.album_name = song.album.name; 
      song.album_image_url = song.album.image_url; 
      song.artists = song.album.artists; 
      delete song.album;
      return song
    })
    .flat(Infinity)
  return songs
}

const getMovieFilePath = async (movie_id) => {
  const result = await prisma.movie.findUnique({
    select: {
      fs_path: true
    },
    where: {
      tmdb_id: movie_id
    }
  })
  return result.fs_path
}

const getEpisodeFilePath = async (tv_show_id, season_number, episode_number) => {
  const result = await prisma.season.findUnique({
    select: {
      episodes: {
        where: {
          season_number: season_number,
          episode_number: episode_number
        },
        select: {
          fs_path: true
        }
      }
    },
    where: {
      tv_show_tmdb_id: tv_show_id
    }
  })
  return result.fs_path
}

const getSongFilePath = async (album_id, disc_number, track_number) => {
  const result = await prisma.album.findUnique({
    select: {
      songs: {
        where: {
          disc_number: disc_number,
          track_number: track_number
        },
        select: {
          fs_path: true
        }
      }
    },
    where: {
      spotify_id: album_id
    }
  })
  return result.fs_path
}

const getRandomMovieOrTVShow = async () => {
  const result = Math.random() < (await prisma.tVShow.count() / await prisma.movie.count()).toFixed(2) ? 
    await getRandomTVShow() : await getRandomMovie()
  return result
}

const getRandomMovie = async () => {
  const id = Math.floor(Math.random() * await prisma.movie.count())
  const result = await prisma.movie.findUnique({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    where: {
      tmdb_id: id
    }
  })
  return result
}

const getRandomTVShow = async () => {
  const id = Math.floor(Math.random() * await prisma.tVShow.count())
  const result = await prisma.tVShow.findUnique({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    where: {
      tmdb_id: id
    }
  })
  return result
}

module.exports = { getAbout,
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
  getRecentlyAddedMusic,
  getAllArtists,
  getAllAlbums,
  getMusicAlbum,
  getAllSongs,
  getMovieFilePath,
  getSongFilePath,
  getEpisodeFilePath,
  searchMoviesAndTV,
  searchMusic,
  getRandomMovieOrTVShow }