const chokidar = require('chokidar');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { getMovieMetaData, getTVShowMetaData, getAlbumMetaData } = require('../models');
var notAvailable = [];
var fileSystem = [];
var ready;

var watcher = chokidar.watch([process.env.MOVIES_PATH, process.env.TV_PATH, process.env.MUSIC_PATH], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

watcher.on('ready', () => {
  console.log('Initial scan complete. Ready for changes')
  ready = true;
  collection = watcher.getWatched()
  ready && sync()
})

watcher
  .on('add', path => {
    console.log(`File ${path} has been added`)
    fileSystem.push(path)
    ready && sync()
  })
  .on('change', path => {
    console.log(`File ${path} has been changed`)
  })
  .on('unlink', path => {
    console.log(`File ${path} has been removed`)
    fileSystem = fileSystem.filter(e => e !== path)
    ready && sync()
  })

const sync = async () => {

  notAvailable = await getNotAvailable()
  console.log(`notAvailable is ${notAvailable.length}`)
  console.table(notAvailable)

  const database = await getAllFiles()

  const rowsToInsert = fileSystem.filter(x => !database.includes(x))
                      .filter(x => !notAvailable.includes(x))
  const intersection = database.filter(x => fileSystem.includes(x))
  const rowsToDelete = database.filter(x => !fileSystem.includes(x))

  console.log(`intersection is ${intersection.length}`)
  console.log(`exclusiveToFileSystem is ${rowsToInsert.length}`)
  console.log(`exclusiveToDatabase is ${rowsToDelete.length}`)
  console.table(rowsToInsert)
  console.table(rowsToDelete)

  // insert to db
  rowsToInsert.length && await upsertManyMovies(rowsToInsert.filter(file => file.startsWith(process.env.MOVIES_PATH)))
  rowsToInsert.length && await upsertManyTVEpisodes(rowsToInsert.filter(file => file.startsWith(process.env.TV_PATH)))
  rowsToInsert.length && await upsertManySongs(rowsToInsert.filter(file => file.startsWith(process.env.MUSIC_PATH)))

  // delete from db
  rowsToDelete.length && await deleteManyMovies(rowsToDelete.filter(file => file.startsWith(process.env.MOVIES_PATH)))
  rowsToDelete.length && await deleteManyTVEpisodes(rowsToDelete.filter(file => file.startsWith(process.env.TV_PATH)))
  rowsToDelete.length && await deleteManySongs(rowsToDelete.filter(file => file.startsWith(process.env.MUSIC_PATH)))
}

const upsertAll = (filter = ["movies", "tv", "music"]) => {
  let jobs = []
  filter.map(media => {
    if (media == "movies") jobs.push(upsertManyMovies(fileSystem.filter(file => file.startsWith(process.env.MOVIES_PATH))))
    if (media == "tv") jobs.push(upsertManyTVEpisodes(fileSystem.filter(file => file.startsWith(process.env.TV_PATH))))
    if (media == "music") jobs.push(upsertManySongs(fileSystem.filter(file => file.startsWith(process.env.MUSIC_PATH))))
  })
  jobs.reduce((p, fn) => p.then(fn), Promise.resolve())
}

const upsertManyMovies = async (movies) => {
  console.log('Generating data for Movies...')

  for (let file of movies){
    try {
      let result = await getMovieMetaData(file);
      if (result.status == 404) {
        upsertNotAvailable(result.fs_path)
        continue;
      }

      const credits = result.credits
      delete result.credits

      const movie = {
        ...result,
        genres: {
          connectOrCreate: result.genres.map(g => ({
            create: g,
            where: { tmdb_id: g.tmdb_id },
          }))
        },
        production_companies: {
          connectOrCreate: result.production_companies.map(p => ({
            create: p,
            where: { tmdb_id: p.tmdb_id },
          }))
        },
        similar: {
          connectOrCreate: result.similar.map(s => ({
            create: s,
            where: { tmdb_id: s.tmdb_id },
          }))
        }
      }
    
      await prisma.movie.upsert({
        where: { tmdb_id: result.tmdb_id },
        update: movie,
        create: movie
      })
      
      for (var c of credits) {
        let obj = {}
        if (c.character) {
          obj.unique_movie_cast_id = {}
          obj.unique_movie_cast_id.movie_tmdb_id = movie.tmdb_id
          obj.unique_movie_cast_id.tmdb_id = c.tmdb_id
          obj.unique_movie_cast_id.character = c.character 
        }
        if (c.job) {
          obj.unique_movie_crew_id = {}
          obj.unique_movie_crew_id.movie_tmdb_id = movie.tmdb_id
          obj.unique_movie_crew_id.tmdb_id = c.tmdb_id
          obj.unique_movie_crew_id.job = c.job
        }

        if (Object.keys(obj).length == 0) continue
        await prisma.credit.upsert({
          where: obj,
          update: {},
          create: {
            ...c,
            movie: { connect: { tmdb_id : movie.tmdb_id }}
          }
        })
      }

    } catch(e) {
      console.log("There was a problem adding this movie", e)
      break; // break or continue
    }
  }
  console.log('[MOVIES] Done')
}

const upsertManyTVEpisodes = async (episodes) => {
  console.log('Generating data for TV...')

  for (let file of episodes){
    try {
      let result = await getTVShowMetaData(file)
      if (result.status == 404) {
        upsertNotAvailable(result.fs_path)
        continue;
      }

      const seasons = result.seasons.map(s => {
        return {
          ...s,
          episodes: {
            connectOrCreate: s.episodes.map(e => ({
              create: e,
              where: { tmdb_id: e.tmdb_id }
            }))
          },
          tv_show: { connect: { tmdb_id : result.tmdb_id }}
        }
      })
      const credits = result.credits

      delete result.created_by
      delete result.seasons
      delete result.credits

      const tv_show = {
        ...result,
        genres: {
          connectOrCreate: result.genres.map(g => ({
            create: g,
            where: { tmdb_id: g.tmdb_id },
          }))
        },
        production_companies: {
          connectOrCreate: result.production_companies.map(p => ({
            create: p,
            where: { tmdb_id: p.tmdb_id },
          }))
        },
        similar: {
          connectOrCreate: result.similar.map(s => ({
            create: s,
            where: { tmdb_id: s.tmdb_id },
          }))
        }
      }

      await prisma.tVShow.upsert({
        where: { tmdb_id: result.tmdb_id },
        update: tv_show,
        create: tv_show
      })

      for (var s of seasons) {
        await prisma.season.upsert({
          where: { tmdb_id: s.tmdb_id },
          update: s,
          create: s
        })
      }

      for (var c of credits) {
        let obj = {}
        if (c.character) {
          obj.unique_tv_show_cast_id = {}
          obj.unique_tv_show_cast_id.tv_show_tmdb_id = tv_show.tmdb_id
          obj.unique_tv_show_cast_id.tmdb_id = c.tmdb_id
          obj.unique_tv_show_cast_id.character = c.character 
        }
        if (c.job) {
          obj.unique_tv_show_crew_id = {}
          obj.unique_tv_show_crew_id.tv_show_tmdb_id = tv_show.tmdb_id
          obj.unique_tv_show_crew_id.tmdb_id = c.tmdb_id
          obj.unique_tv_show_crew_id.job = c.job
        }

        if (Object.keys(obj).length == 0) continue
        await prisma.credit.upsert({
          where: obj,
          update: {},
          create: {
            ...c,
            tv_show: { connect: { tmdb_id : tv_show.tmdb_id }}
          }
        })
      }

    } catch(e) {
      console.log("There was a problem adding this episode", e)
      break; // break or continue
    }
  }
  console.log('[TV] Done')
}

const upsertManySongs = async (songs) => {
  console.log('Generating data for Music...')

  for (let file of songs) {
    try {
      let result = await getAlbumMetaData(file)
      if (result.status == 404) {
        upsertNotAvailable(result.fs_path)
        continue;
      }

      const album = {
        ...result,
        artists: {
          connectOrCreate: result.artists.map(a => ({
            create: a,
            where: { spotify_id: a.spotify_id }
          }))
        },
        songs: {
          connectOrCreate: result.songs.map(s => ({
            create: s,
            where: { spotify_id: s.spotify_id }
          }))
        }
      }
      
      await prisma.album.upsert({
        where: { spotify_id: result.spotify_id },
        update: album,
        create: album
      })

    } catch(e) {
      console.log("There was a problem adding this song", e)
      break; // break or continue
    }
  }

  console.log('[MUSIC] Done')
}

const upsertNotAvailable = async (file) => {
  await prisma.notAvailable.upsert({
    where: { fs_path: file },
    update: { fs_path: file },
    create: { fs_path: file }
  })
}

const getAll = async () => {
  var movies = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true }
  })
  movies.map(movie => {
    movie.id = movie.tmdb_id
    delete movie.tmdb_id

    movie.genres.map(g => {
      g.id = g.tmdb_id;
      delete g.tmdb_id;
    })

    movie.production_companies.map(p => {
      p.id = p.tmdb_id
      delete p.tmdb_id
    })

    movie.credits.map(c => {
      c.id = c.tmdb_id
      delete c.tmdb_id
      delete c.movie_tmdb_id
      delete c.tv_show_tmdb_id
    })

    movie.credits = movie.credits.reduce((acc, credit) => {
      if (credit.character) acc.cast.push(credit);
      if (credit.job) acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
    movie.credits.cast.sort((a,b) => a.order - b.order)

    movie.similar.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
    })
  })

  var tv_shows = await prisma.tVShow.findMany({
    include: { genres: true, production_companies: true, seasons: { include: { episodes: true } }, credits: true, similar: true }
  })

  tv_shows.map(tv_show => {
    tv_show.id = tv_show.tmdb_id
    delete tv_show.tmdb_id

    tv_show.genres.map(g => {
      g.id = g.tmdb_id
      delete g.tmdb_id
    })

    tv_show.production_companies.map(p => {
      p.id = p.tmdb_id
      delete p.tmdb_id
    })

    tv_show.seasons.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
      delete s.tv_show_tmdb_id
      s.episodes.map(e => {
        e.id = e.tmdb_id
        delete e.tmdb_id
        delete e.season_tmdb_id
      })
    })

    tv_show.credits.map(c => {
      c.id = c.tmdb_id
      delete c.tmdb_id
      delete c.movie_tmdb_id
      delete c.tv_show_tmdb_id
    })

    tv_show.credits = tv_show.credits.reduce((acc, credit) => {
      if (credit.character) acc.cast.push(credit);
      if (credit.job) acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
    tv_show.credits.cast.sort((a,b) => a.order - b.order)

    tv_show.similar.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
    })
  })

  var albums = await prisma.album.findMany({
    include: { artists: true, songs: true }
  })

  albums.map(album => {
    album.id = album.spotify_id
    delete album.spotify_id

    album.artists.map(a => {
      a.id = a.spotify_id
      delete a.spotify_id
    })

    album.songs.map(s => {
      s.id = s.spotify_id
      delete s.spotify_id
      delete s.album_spotify_id
    })
  })

  return { movies: movies, tv: tv_shows, music: albums }
}

const getAllFiles = async () => {
  var movies = await prisma.movie.findMany({
    select: { fs_path: true }
  })
  var episodes = await prisma.episode.findMany({
    select: { fs_path: true }
  })
  var songs = await prisma.song.findMany({
    select: { fs_path: true }
  })

  return [].concat(movies).concat(episodes).concat(songs).map(Object.values).flat(Infinity)
}

const getNotAvailable = async () => {
  var notAvailable = await prisma.notAvailable.findMany({
    select: { fs_path: true }
  })

  return notAvailable.map(Object.values).flat(Infinity)
}

const deleteManyMovies = async (movies) => {
  for (let file of movies){
    try {
      await prisma.movie.delete({
        where: {
          tmdb_id: file.id 
        }
      })
    } catch(e) {
      console.log("There was a problem removing this movie", e)
      break; // break or continue
    }
  console.log('[MOVIES] Done')
  }
}

const deleteManyTVEpisodes = async (episodes) => {
  for (let file of episodes){
    try {
      await prisma.episode.delete({
        where: {
          tmdb_id: file.id 
        }
      })
    } catch(e) {
      console.log("There was a problem removing this episode", e)
      break; // break or continue
    }
  console.log('[TV] Done')
  }
}

const deleteManySongs = async (songs) => {
  for (let file of songs){
    try {
      await prisma.song.delete({
        where: {
          spotify_id: file.id 
        }
      })
    } catch(e) {
      console.log("There was a problem removing this song", e)
      break; // break or continue
    }
  console.log('[MUSIC] Done')
  }
}

module.exports = { getAll, upsertAll }