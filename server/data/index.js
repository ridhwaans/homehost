const { Type, Collection } = require('../constants')
const { shuffleArr, formatMany, formatOne } = require('../utils')
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
  return result
}

const getAllAlbums = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true }
  })
  return result
}

const lastAddedSong = (album) => {
  return Math.max(...album.songs.map(s => s.mtime))
}

const getRecentlyAddedAlbums = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true }
  })
  return result.sort((a, b) => lastAddedSong(b) - lastAddedSong(a))
}

const getLatestAlbumReleases = async () => {
  const result = await prisma.album.findMany({
    include: { artists: true, songs: true },
    orderBy: {
      release_date: "desc"
    }
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

const getRecentlyAddedSongs = async () => {
  const result = await prisma.song.findMany({
    include: { album: { include: { artists: true } } },
    orderBy: {
      mtime: "desc"
    }
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
  const ratio = await prisma.tVShow.count() / await prisma.movie.count()
  const result = await Math.random() < ratio ? 
    await getRandomTVShow() : await getRandomMovie()
  return result
}

const getRandomMovie = async () => {
  const id = Math.floor(Math.random() * await prisma.movie.count()) + 1
  const result = await prisma.movie.findUnique({
    include: { genres: true, production_companies: true, credits: true, similar: true },
    where: {
      id: id
    }
  })
  return result
}

const getRandomTVShow = async () => {
  const id = Math.floor(Math.random() * await prisma.tVShow.count()) + 1
  const result = await prisma.tVShow.findUnique({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true },
    where: {
      id: id
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