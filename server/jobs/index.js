const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const { Album, Artist, Movie, TVEpisode, TVShow } = require('../models');
const metadataServiceConstructor = require('../services/metadata');
const metadataService = new metadataServiceConstructor()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const DATA_PATH = path.resolve(__dirname,'../prisma/data')
const notAvailableInAPI = fs.readFileSync(`${DATA_PATH}/not_available.txt`, "utf-8").split("\n").map(i => i.replace(/(\r\n|\n|\r)/gm, ""))

var fileSystem = [];
var watcher = chokidar.watch([process.env.MOVIES_PATH, process.env.TV_PATH, process.env.MUSIC_PATH], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});
var ready;

const containsAny = (str, substrings) => {
  for (var i = 0; i != substrings.length; i++) {
     var substring = substrings[i];
     if (str.indexOf(substring) != - 1) {
       return substring;
     }
  }
  return null; 
}

const sync = async () => {

  const database = await getAllFiles()

  const rowsToInsert = fileSystem.filter(x => !database.includes(x))
    .filter(x => !containsAny(x, notAvailableInAPI))
  const intersection = database.filter(x => fileSystem.includes(x))
  const rowsToDelete = database.filter(x => !fileSystem.includes(x))

  console.log(`intersection is ${intersection.length}`)
  console.log(`exclusiveToFileSystem is ${rowsToInsert.length}:`)
  console.log(`exclusiveToDatabase is ${rowsToDelete.length}:`)
  console.table(rowsToInsert)
  console.table(rowsToDelete)

  // insert to db
  rowsToInsert.length && await upsertManyMovies(rowsToInsert.filter(file => file.startsWith(process.env.MOVIES_PATH)))
  rowsToInsert.length && await upsertManyTVEpisodes(rowsToInsert.filter(file => file.startsWith(process.env.TV_PATH)))
  rowsToInsert.length && await upsertManySongs(rowsToInsert.filter(file => file.startsWith(process.env.MUSIC_PATH)))

  // delete from db
}

watcher.on('ready', () => {
  console.log('Initial scan complete. Ready for changes')
  ready = true;

  collection = watcher.getWatched()
  console.log("Not available in API:")
  console.table(notAvailableInAPI)
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

const generateMetaData = (filter = ["movies", "tv", "music"]) => {
  let jobs = []
  filter.map(media => {
    if (media == "movies") jobs.push(upsertManyMovies)
    if (media == "tv") jobs.push(upsertManyTVEpisodes)
    if (media == "music") jobs.push(upsertManySongs)
  })
  jobs.reduce((p, fn) => p.then(fn), Promise.resolve())
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
    })

    movie.credits = movie.credits.reduce((acc, credit) => {
      if (credit.cast_id != null) acc.cast.push(credit);
      else acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
    movie.credits.cast.sort((a,b) => a.order - b.order)

    movie.similar.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
    })
  })

  var tv_shows = await prisma.tVShow.findMany({
    include: { created_by: true, genres: true, production_companies: true, seasons: true, credits: true, similar: true }
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
      s.episodes =[]
      // s.episodes.map(e => {
      //   e.id = e.tmdb_id
      //   delete e.tmdb_id
      // })  
    })

    tv_show.credits.map(c => {
      c.id = c.tmdb_id
      delete c.tmdb_id
    })

    tv_show.credits = tv_show.credits.reduce((acc, credit) => {
      if (credit.cast_id != null) acc.cast.push(credit);
      else acc.crew.push(credit);
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

  return movies.concat(episodes).concat(songs).map(Object.values).flat(Infinity)
}

const getMovieMetaData = async (file) => {
  let re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id
  console.log('GET: ' + file);
  let movie = await metadataService.get(new Movie({ id: file.match(re)[1] }))
  let logo = movie.images.logos.find(logo => logo.iso_639_1 == "en")
  return {
    type: Movie.name,
    tmdb_id: movie.id,
    fs_path: file,
    url_path: `/movies/${movie.id}`,
    ctime: fs.statSync(file).ctime,
    mtime: fs.statSync(file).mtime,
    adult: movie.adult,
    backdrop_path: movie.backdrop_path,
    budget: movie.budget,
    genres: movie.genres.map(genre => ({ 
      tmdb_id: genre.id, 
      name: genre.name
    })),
    imdb_id: movie.imdb_id,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    production_companies: movie.production_companies.map(production_company => ({ 
      tmdb_id: production_company.id, 
      logo_path: production_company.logo_path, 
      name: production_company.name,
      origin_country: production_company.origin_country
    })),
    release_date: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    tagline: movie.tagline,
    title: movie.title,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    logo_path: logo ? logo.file_path : "",
    credits: movie.credits.cast.concat(movie.credits.crew).map(credit => ({ 
      tmdb_id: credit.id, 
      adult: credit.adult, 
      gender: credit.gender,
      known_for_department: credit.known_for_department,
      name: credit.name,
      popularity: credit.popularity,
      profile_path: credit.profile_path,
      cast_id: credit.cast_id,
      character: credit.character,
      credit_id: credit.credit_id,
      order: credit.order,
      department: credit.department,
      job: credit.job
    })),
    similar: movie.similar.results.slice(0, 4).map(similar_result => ({ 
      tmdb_id: similar_result.id, 
      backdrop_path: similar_result.backdrop_path, 
      title: similar_result.title,
      name: similar_result.name,
      release_date: similar_result.release_date,
      overview: similar_result.overview,
      poster_path: similar_result.poster_path
    }))
  }
}

const upsertManyMovies = async (movies) => {
  console.log('Generating data for Movies...')

  for (let file of movies){
    try {
      let result = await getMovieMetaData(file);

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
        credits: {
          connectOrCreate: result.credits.map(c => ({
            create: c,
            where: { tmdb_id: c.tmdb_id },
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

    } catch(e) {
      console.log("There was a problem fetching metadata. Skipping this movie", e)
      continue; // break or continue
    }
  }
  console.log('[MOVIES] Done')
}

const getTVEpisodeMetaData = async (file) => {
  let re = new RegExp(/(\d+)$/); // tv_id
      re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)

  console.log('GET: ' + file);
  // find tv episode on TMDb
  let tv_id = parseInt(path.dirname(file).match(re)[1])
  let season_number = parseInt(file.match(re2)[1])
  let episode_number = parseInt(file.match(re2)[2])
  let episode = await metadataService.get(new TVEpisode({ tv_id: tv_id, season_number: season_number, episode_number: episode_number }))

  return {
    type: TVEpisode.name,
    tmdb_id: episode.id,
    fs_path: file,
    url_path: `/tv/${tv_id}/${episode.season_number}/${episode.episode_number}`,
    ctime: fs.statSync(file).ctime,
    mtime: fs.statSync(file).mtime,
    air_date: episode.air_date,
    episode_number: episode.episode_number,
    name: episode.name,
    overview: episode.overview,
    season_number: episode.season_number,
    still_path: episode.still_path || "",
    vote_average: episode.vote_average,
    vote_count: episode.vote_count
  }
}

const getTVShowMetaData = async (file) => {
  let re = new RegExp(/(\d+)$/); // tv_id
      re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)
      
  console.log('GET: ' + file);
  // find tv show on TMDb
  let tv_id = parseInt(path.dirname(file).match(re)[1])
  let season_number = parseInt(file.match(re2)[1])
  let episode_number = parseInt(file.match(re2)[2])
  let tv_show = await metadataService.get(new TVShow({ id: tv_id }))
  let episode = await getTVEpisodeMetaData(file)
  tv_show.seasons = tv_show.seasons.filter(season => season.season_number == season_number.toString())
  let logo = tv_show.images.logos.find(logo => logo.iso_639_1 == "en")
  return {
    type: TVShow.name,
    tmdb_id: tv_show.id,
    backdrop_path: tv_show.backdrop_path,
    created_by: tv_show.created_by.map(creator => ({
      tmdb_id: creator.id, 
      credit_id: creator.credit_id,
      name: creator.name,
      gender: creator.gender,
      profile_path: creator.profile_path,
    })),
    genres: tv_show.genres.map(genre => ({ 
      tmdb_id: genre.id, 
      name: genre.name
    })),
    name: tv_show.name,
    overview: tv_show.overview,
    popularity: tv_show.popularity,
    poster_path: tv_show.poster_path,
    production_companies: tv_show.production_companies.map(production_company => ({
      tmdb_id: production_company.id, 
      logo_path: production_company.logo_path, 
      name: production_company.name,
      origin_country: production_company.origin_country
    })),
    seasons: tv_show.seasons.map(season => ({
      tmdb_id: season.id,
      air_date: season.air_date,
      name: season.name,
      overview: season.overview,
      poster_path: season.poster_path,
      season_number: season.season_number,
      episodes: [episode]
    })),
    tagline: tv_show.tagline,
    vote_average: tv_show.vote_average,
    vote_count: tv_show.vote_count,
    logo_path: logo ? logo.file_path : "",
    credits: tv_show.credits.cast.concat(tv_show.credits.crew).map(credit => ({
      tmdb_id: credit.id, 
      adult: credit.adult, 
      gender: credit.gender,
      known_for_department: credit.known_for_department,
      name: credit.name,
      popularity: credit.popularity,
      profile_path: credit.profile_path,
      cast_id: credit.cast_id,
      character: credit.character,
      credit_id: credit.credit_id,
      order: credit.order,
      department: credit.department,
      job: credit.job
    })),
    similar: tv_show.similar.results.slice(0, 4).map(similar_result => ({ 
      tmdb_id: similar_result.id, 
      backdrop_path: similar_result.backdrop_path, 
      title: similar_result.title,
      name: similar_result.name,
      first_air_date: similar_result.first_air_date,
      overview: similar_result.overview,
      poster_path: similar_result.poster_path
    })),
    imdb_id: tv_show.external_ids.imdb_id
  }
}

const upsertManyTVEpisodes = async (episodes) => {
  console.log('Generating data for TV...')

  for (let file of episodes){
    try {
      let result = await getTVShowMetaData(file)
      
      const seasons = result.seasons.map(s => {
        return {
          ...s,
          episodes: {
            connectOrCreate: s.episodes.map(e => ({
              create: e,
              where: { tmdb_id: e.tmdb_id }
            }))
          },
          show: { connect: { tmdb_id : result.tmdb_id }}
        }
      })
      delete result.seasons

      const tv_show = {
        ...result,
        created_by: {
          connectOrCreate: result.created_by.map(c => ({
            create: c,
            where: { tmdb_id: c.tmdb_id },
          }))
        },
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
        credits: {
          connectOrCreate: result.credits.map(c => ({
            create: c,
            where: { tmdb_id: c.tmdb_id },
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

    } catch(e) {
      console.log("There was a problem fetching metadata. Skipping this show", e)
      continue; // break or continue
    }
  }
  console.log('[TV] Done')
}

const getUnknownAlbumMetaData = async (file) => {
  let re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "Unknown Album";
      unknown_id = "no_spotify_id";

  console.log('GET: ' + file);
  // build music album not on Spotify
  const last = await prisma.song.aggregate({
    where: { album_spotify_id: unknown_id },
    _max: {
      track_number: true
    }
  })
  let disc_number = 1
  let track_number = last._max.track_number ? last._max.track_number + 1 : 1

  return {
    type: Album.name,
    spotify_id: unknown_id,
    album_type: 'compilation',
    artists: [{ type: Artist.name, spotify_id: unknown_id, name: 'Unknown Artist', image_url: 'http://i.imgur.com/bVnx0IY.png' }],
    image_url: 'http://i.imgur.com/bVnx0IY.png',
    label: 'Unknown Label',
    name: unknown_album,
    popularity: null,
    release_date: 'NaN',
    songs: [
      {
        spotify_id: last._max.track_number ? `${unknown_id}_${last._max.track_number + 1}` : `${unknown_id}_${0}`,
        name: path.basename(file).replace(/.mp3|.flac/gi,''),
        disc_number: disc_number,
        track_number: track_number,
        fs_path: file,
        url_path: `/music/${unknown_id}/${disc_number}/${track_number}`,
        ctime: fs.statSync(file).ctime,
        mtime: fs.statSync(file).mtime,
        duration_ms: parseInt(await getAudioDurationInSeconds(file) * 1000),
        explicit: false,
        preview_url: null
      }
    ],
    total_tracks: track_number
  }
}

const getAlbumMetaData = async (file) => {
  let re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "Unknown Album";

  console.log('GET: ' + file);

  let album_path = path.dirname(file)
  if (album_path.toUpperCase().endsWith(unknown_album.toUpperCase())){
    return getUnknownAlbumMetaData(file)
  }

  // find the Spotify music album
  let album = await metadataService.get(new Album({ id: album_path.match(re)[1] }))
  // find missing artist(s) information for the Spotify music album
  for (var current_artist of album.artists) {
    let artist = await metadataService.get(new Artist({ id: current_artist.id }))
    current_artist.image_url = artist.images ? artist.images[0].url : 'http://i.imgur.com/bVnx0IY.png'
    current_artist.popularity = artist.popularity
  }

  // if local track found
  let disc_number = parseInt(path.basename(file).match(re2)[1] || 1)
  let track_number = parseInt(path.basename(file).match(re2)[3])
  
  album.tracks.items = album.tracks.items.filter((item) => { 
    if ((item.disc_number == disc_number) && (item.track_number == track_number)) { return true } 
  })

  return {
    type: Album.name,
    spotify_id: album.id,
    album_type: album.album_type,
    artists: album.artists.map(artist => ({
      type: Artist.name,
      spotify_id: artist.id,
      name: artist.name,
      image_url: artist.image_url,
      popularity: artist.popularity
    })),
    image_url: album.images[0].url,
    label: album.label,
    name: album.name,
    popularity: album.popularity,
    release_date: album.release_date,
    songs: album.tracks.items.map(track_item => ({
      spotify_id: track_item.id,
      fs_path: file,
      url_path: `/music/${album.id}/${track_item.disc_number}/${track_item.track_number}`,
      ctime: fs.statSync(file).ctime,
      mtime: fs.statSync(file).mtime,
      disc_number: track_item.disc_number,
      duration_ms: track_item.duration_ms,
      explicit: track_item.explicit,
      name: track_item.name,
      preview_url: track_item.preview_url,
      track_number: track_item.track_number
    })),
    total_tracks: album.total_tracks
  }
}

const upsertManySongs = async (songs) => {
  console.log('Generating data for Music...')

  for (let file of songs) {
    try {
      let result = await getAlbumMetaData(file)

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
      console.log("There was a problem fetching metadata. Skipping this album", e)
      continue; // break or continue
    }
  }

  console.log('[MUSIC] Done')
}

module.exports = { getAll, generateMetaData }