const { shuffleArr, format } = require('../utils')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
  
const searchMoviesAndTV = async (keyword) => {
  let search_results = {}

  const movies = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    where: {
      OR: [
      { title: { contains: keyword } },
      { tagline: { contains: keyword } },
      { overview: { contains: keyword } },
      { credits: {
          some: {
            name: { contains: keyword }
          }
        }
      }
      ]
    }
  })

  const tv_shows = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    where: {
      OR: [
      { name: { contains: keyword } },
      { tagline: { contains: keyword } },
      { overview: { contains: keyword } },
      { seasons: {
          some: {
            OR: [
              { name: { contains: keyword } },
              { overview: { contains: keyword } }
            ]
          },
          episodes: {
            some: {
              OR: [
                { name: { contains: keyword } },
                { overview: { contains: keyword } }
              ]
            }
          }  
        } 
      },
      { credits: {
          some: {
            name: { contains: keyword }
          }
        }
      }
      ]
    }
  })

  search_results.results = [].concat(tv_shows).concat(movies)
  search_results.count = search_results.results.length
  return search_results
}

const searchMusic = async (keyword) => {
  let search_results = {results: {songs:[], artists: [], albums: []}, song_count: 0, artist_count: 0, album_count: 0, total_count: 0}
  if (keyword.trim() == "") {
    return search_results
  }

  search_results.results.songs = await prisma.song.findMany({
    where: {
      name: {
        contains: keyword
      }
    }
  })
  search_results.results.artists = await prisma.artist.findMany({
    where: {
      name: {
        contains: keyword
      }
    }
  })
  search_results.results.albums = await prisma.album.findMany({
    include: { artists: true, songs: true },
    where: {
      name: {
        contains: keyword
      }
    }
  })
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
  return format(result)
}

const getMostPopularMovies = async () => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    orderBy: {
      popularity: "desc"
    },
    take: 25
  })
  return format(result)
}

const getHighestRatedMovies = async () => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    orderBy: {
      vote_average: "desc"
    },
    take: 25
  })
  return format(result)
}

const getRecentlyAddedMovies = async () => {
  const result = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    orderBy: {
      mtime: "desc"
    },
    take: 25
  })
  return format(result)
}

const getMovieGenres = async () => {
  const result = await prisma.genre.findMany({
    orderBy: {
      name: "asc"
    }
  })
  return format(result)
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
  return shuffleArr(format(result))
}

const getMovie = async (movie_id) => {
  const result = await prisma.movie.findUnique({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    where: {
      tmdb_id: parseInt(movie_id)
    }
  })
  return format(result)
}

const getAllTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true }
  })
  return format(result)
}

const getMostPopularTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    orderBy: {
      popularity: "desc"
      },
    take: 25
  })
  return format(result)
}

const getHighestRatedTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    orderBy: {
      vote_average: "desc"
      },
    take: 25
  })
  return format(result)
}

const lastAddedEpisode = (tv_show) => {
  return Math.max(...tv_show.seasons.map(s => s.episodes.map(e => e.mtime)).flat(Infinity))
}

const getRecentlyAddedTVShows = async () => {
  const result = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true }
  })
  return result.sort((a, b) => lastAddedEpisode(b) - lastAddedEpisode(a))
}

const getTVShowGenres = async () => {
  const result = await prisma.genre.findMany({
    orderBy: {
      name: "asc"
    }
  })
  return format(result)
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
  return shuffleArr(format(result))
}

const getTVShow = async (tv_show_id) => {
  const result = await prisma.tVShow.findUnique({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    where: {
      tmdb_id: parseInt(tv_show_id)
    }
  })
  return format(result)
}

const getAllArtists = async () => {
  const result = await prisma.artist.findMany()
  return result
}

const getMostPopularArtists = async () => {
  const result = await prisma.artist.findMany({
    orderBy: {
      popularity: "desc"
    }
  })
  return format(result)
}

const getAllAlbums = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true }
  })
  return format(result)
}

const lastAddedSong = (album) => {
  return Math.max(...album.songs.map(s => s.mtime))
}

const getRecentlyAddedAlbums = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true }
  })
  return format(result.sort((a, b) => lastAddedSong(b) - lastAddedSong(a)))
}

const getLatestAlbumReleases = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true },
    orderBy: {
      release_date: "desc"
    }
  })
  return format(result)
}

const getMusicAlbum = async (album_id) => {
  const result = await prisma.album.findUnique({
    include: { artists: true, songs: true },
    where: {
      spotify_id: album_id
    }
  })
  return format(result)
}

const getAllSongs = async () => {
  const result = await prisma.song.findMany({
    include: { album: { include: { artists: true } } }
  })
  return result
}

const getRecentlyAddedSongs = async () => {
  const result = await prisma.song.findMany({
    include: { album: { include: { artists: true } } },
    orderBy: {
      mtime: "desc"
    }
  })
  return format(result)
}

const getRandomMovieOrTVShow = async () => {
  const ratio = await prisma.tVShow.count() / await prisma.movie.count()
  const result = await Math.random() < ratio ? 
    await getRandomTVShow() : await getRandomMovie()
  return format(result)
}

const getRandomMovie = async () => {
  const id = Math.floor(Math.random() * await prisma.movie.count()) + 1
  const result = await prisma.movie.findUnique({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    where: {
      id: id
    }
  })
  return format(result)
}

const getRandomTVShow = async () => {
  const id = Math.floor(Math.random() * await prisma.tVShow.count()) + 1
  const result = await prisma.tVShow.findUnique({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    where: {
      id: id
    }
  })
  return format(result)
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
  searchMusic }