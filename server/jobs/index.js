const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const sqlite3 = require('sqlite3').verbose();
const { getAudioDurationInSeconds } = require('get-audio-duration');
const { Album, Artist, Movie, TVEpisode, TVShow } = require('../models');
const { findTotalDurationMillis } = require('../utils');
const metadataServiceConstructor = require('../services/metadata');
const metadataService = new metadataServiceConstructor()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const DATA_PATH = path.resolve(__dirname,'../data')
const notAvailableInAPI = fs.readFileSync(`${DATA_PATH}/not_available.txt`, "utf-8").split("\n").map(i => i.replace(/(\r\n|\n|\r)/gm, ""))

var fileSystem = [];
var watcher = chokidar.watch([process.env.MOVIES_PATH, process.env.TV_PATH, process.env.MUSIC_PATH], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});
var ready;

function containsAny(str, substrings) {
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
    .filter(file => !file.startsWith(process.env.TV_PATH))
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

const getMovieMetaData = async (file) => {
  let re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id
  console.log('GET: ' + file);
  let movie = await metadataService.get(new Movie({ id: file.match(re)[1] }))
  movie.fs_path = file;
  movie.url_path = `/movies/${movie.id}`;
  movie.ctime = fs.statSync(movie.fs_path).ctime;
  movie.mtime = fs.statSync(movie.fs_path).mtime;
  return movie
}

const upsertManyMovies = async (movies) => {
  console.log('Generating data for Movies...')

  for (let file of movies){
    try {
      let result = await getMovieMetaData(file);

      const genres = result.genres.map(genre => {
        return {
          tmdb_id: genre.id, 
          name: genre.name
        }
      });
      
      const production_companies = result.production_companies.map(production_company => {
        return {
          tmdb_id: production_company.id, 
          logo_path: production_company.logo_path, 
          name: production_company.name,
          origin_country: production_company.origin_country
        }
      })
      
      const credits = result.credits.cast.concat(result.credits.crew).map(credit => {
        return {
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
        }
      })
      
      const similar = result.similar.results.slice(0, 4).map(similar_result => {
        return {
          tmdb_id: similar_result.id, 
          backdrop_path: similar_result.backdrop_path, 
          title: similar_result.title,
          name: similar_result.name,
          release_date: similar_result.release_date,
          overview: similar_result.overview,
          poster_path: similar_result.poster_path
        }
      })
      
      const movie = {
        tmdb_id: result.id,
        type: result.type,
        fs_path: result.fs_path,
        url_path: result.url_path,
        ctime: result.ctime,
        mtime: result.mtime,
        adult: result.adult,
        backdrop_path: result.backdrop_path,
        budget: result.budget,
        genres: {
          connectOrCreate: genres.map((g) => ({
            create: g,
            where: { tmdb_id: g.tmdb_id },
          })),
        },
        imdb_id: result.imdb_id,
        overview: result.overview,
        popularity: result.popularity,
        poster_path: result.poster_path,
        production_companies: {
          connectOrCreate: production_companies.map((p) => ({
            create: p,
            where: { tmdb_id: p.tmdb_id },
          })),
        },
        release_date: result.release_date,
        revenue: result.revenue,
        runtime: result.runtime,
        tagline: result.tagline,
        title: result.title,
        vote_average: result.vote_average,
        vote_count: result.vote_count,
        credits: {
          connectOrCreate: credits.map((c) => ({
            create: c,
            where: { tmdb_id: c.tmdb_id },
          })),
        },
        similar: {
          connectOrCreate: similar.map((s) => ({
            create: s,
            where: { tmdb_id: s.tmdb_id },
          })),
        }
      }
      const upsertMovie = await prisma.movie.upsert({
        where: { tmdb_id: result.id },
        update: movie,
        create: movie
      })

    } catch(e) {
      console.log("There was a problem fetching metadata. Skipping this movie", e)
      break; // break or continue
    }
  }
  console.log('[MOVIES] Done')
}

const getAll = async () => {
  var movies = await prisma.movie.findMany({
    include: { genres: true, production_companies: true, credits: true, similar: true }
  })
  movies.map(movie => {
    movie.credits = movie.credits.reduce((acc, credit) => {
      if (credit.cast_id != null) acc.cast.push(credit);
      else acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
  })

  var tv_shows = await prisma.tVShow.findMany({
    include: { created_by: true, genres: true, production_companies: true, seasons: true, credits: true, similar: true }
  })

  tv_shows.map(tv_show => {
    tv_show.credits = tv_show.credits.reduce((acc, credit) => {
      if (credit.cast_id != null) acc.cast.push(credit);
      else acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
  })

  return { movies: movies, tv: tv_shows }
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

const getTVEpisodeMetaData = async (file) => {
  let re = new RegExp(/(\d+)$/); // tv_id
      re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)

  console.log('GET: ' + file);
  // find tv episode on TMDb
  let tv_id = parseInt(path.dirname(file).match(re)[1])
  let season_number = parseInt(file.match(re2)[1])
  let episode_number = parseInt(file.match(re2)[2])
  let episode = await metadataService.get(new TVEpisode({ tv_id: tv_id, season_number: season_number, episode_number: episode_number }))
  episode.fs_path = file
  episode.url_path = `/tv/${tv_id}/${episode.season_number}/${episode.episode_number}`
  episode.ctime = fs.statSync(episode.fs_path).ctime
  episode.mtime = fs.statSync(episode.fs_path).mtime
  return episode;
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
  tv_show.seasons.map((season) => {
    season.episodes = [];
    season.episodes.push(episode);
  })

  return tv_show
}

const upsertManyTVEpisodes = async (episodes) => {
  console.log('Generating data for TV...')

  for (let file of episodes){
    try {
      let result = await getTVShowMetaData(file)
      
      const created_by = result.created_by.map(creator => {
        return {
          tmdb_id: creator.id, 
          credit_id: creator.credit_id,
          name: creator.name,
          gender: creator.gender,
          profile_path: creator.profile_path,
        }
      })

      const genres = result.genres.map(genre => {
        return {
          tmdb_id: genre.id, 
          name: genre.name
        }
      })

      const production_companies = result.production_companies.map(production_company => {
        return {
          tmdb_id: production_company.id, 
          logo_path: production_company.logo_path, 
          name: production_company.name,
          origin_country: production_company.origin_country
        }
      })

      const seasons = result.seasons.map(season => {
        return {
          tmdb_id: season.id,
          air_date: season.air_date,
          name: season.name,
          overview: season.overview,
          poster_path: season.poster_path,
          season_number: season.season_number,
          episodes: {
            connectOrCreate: season.episodes.map((e) => ({
              create: 
              {
                tmdb_id: e.id,
                type: e.type,
                fs_path: e.fs_path,
                url_path: e.url_path,
                ctime: e.ctime,
                mtime: e.mtime,
                air_date: e.air_date,
                episode_number: e.episode_number,
                name: e.name,
                overview: e.overview,
                season_number: e.season_number,
                still_path: e.still_path || result.backdrop_path,
                vote_average: e.vote_average,
                vote_count: e.vote_count
              },
              where: { tmdb_id: e.id },
            })),
          }
        }
      })

      const credits = result.credits.cast.concat(result.credits.crew).map(credit => {
        return {
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
        }
      })

      const similar = result.similar.results.slice(0, 4).map(similar_result => {
        return {
          tmdb_id: similar_result.id, 
          backdrop_path: similar_result.backdrop_path, 
          title: similar_result.title,
          name: similar_result.name,
          first_air_date: similar_result.first_air_date,
          overview: similar_result.overview,
          poster_path: similar_result.poster_path
        }
      })

      const tv_show = {
        tmdb_id: result.id,
        type: result.type,
        backdrop_path: result.backdrop_path,
        created_by: {
          connectOrCreate: created_by.map((c) => ({
            create: c,
            where: { tmdb_id: c.tmdb_id },
          })),
        },
        genres: {
            connectOrCreate: genres.map((g) => ({
              create: g,
              where: { tmdb_id: g.tmdb_id },
            })),
          },
        name: result.name,
        overview: result.overview,
        popularity: result.popularity,
        poster_path: result.poster_path,
        production_companies: {
            connectOrCreate: production_companies.map((p) => ({
              create: p,
              where: { tmdb_id: p.tmdb_id },
            })),
          },
        seasons: {
          connectOrCreate: seasons.map((s) => ({
            create: s,
            where: { tmdb_id: s.tmdb_id }
          })),
        },
        tagline: result.tagline,
        vote_average: result.vote_average,
        vote_count: result.vote_count,
        credits: {
            connectOrCreate: credits.map((c) => ({
              create: c,
              where: { tmdb_id: c.tmdb_id },
            })),
          },
        similar: {
            connectOrCreate: similar.map((s) => ({
              create: s,
              where: { tmdb_id: s.tmdb_id },
            })),
          },
        imdb_id: result.external_ids.imdb_id
      }
      const upsertTVShow = await prisma.tVShow.upsert({
        where: { tmdb_id: result.id },
        update: tv_show,
        create: tv_show
      })

    } catch(e) {
      console.log("There was a problem fetching metadata. Skipping this show", e)
      break; // break or continue
    }
  }
  console.log('[TV] Done')
}

const getUnknownAlbumMetaData = async (file) => {
  let re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "Unknown Album";

  // build music album not on Spotify
  let album = {
    type: Album.name,
    id: 'unknown',
    album_type: 'compilation',
    artists: [{ type: Artist.name, id: 'unknown', name: 'Unknown Artist', images: 'http://i.imgur.com/bVnx0IY.png' }],
    images: 'http://i.imgur.com/bVnx0IY.png',
    label: 'Unknown Label',
    name: unknown_album,
    popularity: null,
    release_date: 'NaN',
    tracks: {items:[]}
  }

  console.log('GET: ' + file);

  let item = {}
  item.id = 'unknown'
  item.name = file.replace(/.mp3|.flac/gi,'')
  item.disc_number = 1
  item.track_number = 1 //index + 1 fetch number from db
  item.fs_path = file
  item.url_path = `/music/${album.id}/${item.disc_number}/${item.track_number}`
  item.ctime = fs.statSync(item.fs_path).ctime
  item.mtime = fs.statSync(item.fs_path).mtime
  item.duration_ms = parseInt(await getAudioDurationInSeconds(item.fs_path) * 1000)
  item.explicit = false
  item.preview_url = null

  album.tracks.items.push(item)

  album.tracks.local_total = album.tracks.items.filter(item => item.url_path != null).length
  album.tracks.total_duration_ms = findTotalDurationMillis(album.tracks.items)
  return album
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
  // remove unnecessary Spotify json
  delete album.available_markets;
  album.tracks.items.map(item => {delete item.artists; delete item.available_markets});
  // find missing artist(s) information for the Spotify music album
  for (var current_artist of album.artists) {
    let artist = await metadataService.get(new Artist({ id: current_artist.id }))
    current_artist.type = artist.type
    current_artist.images = artist.images ? artist.images[0].url : 'http://i.imgur.com/bVnx0IY.png'
    current_artist.popularity = artist.popularity
  }
  album.images = album.images[0].url

  // if local track found
  album.tracks.items = album.tracks.items.filter((item) => {
    (item.disc_number == parseInt(file.match(re2)[1] || 1)) && 
    (item.track_number == parseInt(file.match(re2)[3])) 
  })

  album.tracks.items.map((item) => {
    item.fs_path = file
    item.url_path = `/music/${album.id}/${item.disc_number}/${item.track_number}`
    item.ctime = fs.statSync(item.fs_path).ctime
    item.mtime = fs.statSync(item.fs_path).mtime
  })

  album.tracks.local_total = album.tracks.items.filter(item => item.url_path != null).length
  album.tracks.preview_total = album.tracks.items.filter(item => item.preview_url != null).length
  album.tracks.total_duration_ms = findTotalDurationMillis(album.tracks.items)

  return album
}

const upsertManySongs = async (songs) => {

  console.log('Generating data for Music...')

  for (let file of songs) {
    try {
      let result = await getAlbumMetaData(file)

      const album_artists = result.artists.map(artist => {
        return {
          type: artist.type,
          spotify_id: artist.id,
          name: artist.name,
          images: artist.images,
          popularity: artist.popularity
        }
      })

      const track_items = result.tracks.items.map(track_item => {
        return {
          spotify_id: track_item.id,
          fs_path: track_item.fs_path,
          url_path: track_item.url_path,
          ctime: track_item.ctime,
          mtime: track_item.mtime,
          disc_number: track_item.disc_number,
          duration_ms: track_item.duration_ms,
          explicit: track_item.explicit,
          name: track_item.name,
          preview_url: track_item.preview_url,
          track_number: track_item.track_number
        }
      })

      const album = {
        type: result.type,
        spotify_id: result.id,
        album_type: result.album_type,
        artists: {
          connectOrCreate: album_artists.map((a) => ({
            create: a,
            where: { spotify_id: a.spotify_id },
          })),
        },
        images: result.images,
        label: result.label,
        name: result.name,
        popularity: result.popularity,
        release_date: result.release_date,
        songs: {
          connectOrCreate: track_items.map((s) => ({
            create: s,
            where: { spotify_id: s.spotify_id },
          })),
        }
      }

      const upsertAlbum = await prisma.album.upsert({
        where: { spotify_id: result.id },
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

module.exports = { generateMetaData }