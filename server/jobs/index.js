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

const db = new sqlite3.Database(`${DATA_PATH}/media.db`, (err) => {
  if (err) console.error(err.message);
  console.log('Connected to the test database.');
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS movies (info TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS tv (info TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS music (info TEXT)");
});

const getAll = () => {
  var arr = {};
  arr.movies = dbGetAll("movies")
  arr.tv = dbGetAll("tv")
  arr.music = dbGetAll("music")
  return arr;
}

const dbClear = () => {
  db.serialize(() => {
    db.run("DELETE FROM movies");
    db.run("DELETE FROM tv");
    db.run("DELETE FROM music");
  });
}

const dbGetAll = (table) => {
  var arr = [];
  db.serialize(() => {
    db.each(`SELECT rowid AS id, info FROM ${table}`, (err, row) => {
      row && arr.push(JSON.parse(row.info));
    });
  });
  return arr;
}

const dbInsertMany = (table, objArr) => {
  db.serialize(() => {
    var stmt;
    stmt = db.prepare(`INSERT INTO ${table} VALUES (?)`);
    for (var i = 0; i < objArr.length-1; i++) {
        stmt.run(JSON.stringify(objArr[i]));
    }
    stmt.finalize();
  });
  console.log("done")
}

var database;

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
  // database = getAll()
  // database.movies.map(movie => movie.fs_path).flat(Infinity)
  // database.tv.map(tv => tv.seasons.map(season => season.episodes.map(episode => episode.fs_path))).flat(Infinity)
  // database.music.map(album => album.tracks.items.filter(item => item.fs_path != null).map(item => item.fs_path)).flat(Infinity)

  // const rowsToInsert = fileSystem.filter(x => !database.includes(x)).filter(x => !containsAny(x, notAvailableInAPI)) 
  // const intersection = database.filter(x => fileSystem.includes(x))
  // const rowsToDelete = database.filter(x => !fileSystem.includes(x))

  // console.log(`intersection is ${intersection.length}`)

  // console.log(`exclusiveToFileSystem is ${rowsToInsert.length}:`)
  // console.table(rowsToInsert)
  // // insert to db
  // dbInsertMany("movies", getAllMovieMetaData(rowsToInsert.filter(file => file.startsWith(process.env.MOVIES_PATH))))
  // dbInsertMany("tv", rowsToInsert.filter(file => file.startsWith(process.env.TV_PATH)))
  // dbInsertMany("music", rowsToInsert.filter(file => file.startsWith(process.env.MUSIC_PATH)))

  // console.log(`exclusiveToDatabase is ${rowsToDelete.length}:`)
  // console.table(rowsToDelete)
  // // delete from db

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
    if (media == "movies") jobs.push(getAllMovieMetaData)
    if (media == "tv") jobs.push(getAllTVMetaData)
    if (media == "music") jobs.push(getAllMusicMetaData)
  })
  jobs.reduce((p, fn) => p.then(fn), Promise.resolve())
}

const getMovieMetaData = async (file) => {
  let re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id
  console.log('GET: ' + file);
  const movie = await metadataService.get(new Movie({ id: file.match(re)[1] }))
  movie.fs_path = file;
  movie.url_path = `/movies/${movie.id}`;
  movie.ctime = fs.statSync(movie.fs_path).ctime;
  movie.mtime = fs.statSync(movie.fs_path).mtime;
  return movie
}

const getAllMovieMetaData = async (movies) => {
  var json = { movies: [] };
  console.log('Generating data for Movies...')

  movies = movies || Object.entries(collection).filter(entry => entry[0].startsWith(process.env.MOVIES_PATH));

  movies = movies.map(folder => folder[1]
    .map(file => `${folder[0]}/${file}`))
    .flat(Infinity)
    .filter(file => !movies.map(folder => folder[0]).includes(file)) // remove paths ending with subdirectories from list

    for (let file of movies){
      try {
        json.movies.push(await getMovieMetaData(file));
      } catch(e) {
        console.log("There was a problem fetching metadata. Skipping this movie", e)
        continue; // go next
      }
    }
    dbInsertMany("movies", json.movies)
}


const getTVEpisodeMetaData = async (tv_show, episode_file) => {
  let re = new RegExp(/(\d+)$/); // tv_id
      re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)

  console.log('GET: ' + episode_file);
  // find tv episode on TMDb
  let tv_id = parseInt(tv_show.match(re)[1])
  let season_number = parseInt(episode_file.match(re2)[1])
  let episode_number = parseInt(episode_file.match(re2)[2])
  let episode = await metadataService.get(new TVEpisode({ tv_id: tv_id, season_number: season_number, episode_number: episode_number }))
  episode.fs_path = `${tv_show[0]}/${episode_file}`;
  episode.url_path = `/tv/${tv_id}/${episode.season_number}/${episode.episode_number}`;
  episode.ctime = fs.statSync(episode.fs_path).ctime;
  episode.mtime = fs.statSync(episode.fs_path).mtime;
  return episode;
}

const getTVShowMetaData = async (tv_show) => {
  let re = new RegExp(/(\d+)$/); // tv_id
      re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)
      
  console.log('GET: ' + tv_show);
  // find tv show on TMDb
  let tv_id = parseInt(tv_show.match(re)[1])
  let show = await metadataService.get(new TVShow({ id: tv_id }))
  show.seasons.map(season => season.episodes = [])

  for (let episode_file of tv_show[1]) {
    console.log('GET: ' + episode_file);
    // find tv episode on TMDb
    let season_number = parseInt(episode_file.match(re2)[1])
    let episode_number = parseInt(episode_file.match(re2)[2])
    try {
      let episode = await getTVEpisodeMetaData(tv_show, episode_file)

      let seasonIndex = show.seasons.findIndex(season => season.season_number == season_number.toString()); 
      show.seasons[seasonIndex].episodes.push(episode);
    } catch(e) {
      console.log("There was a problem fetching metadata. Skipping this episode", e)
      continue; // go next
    }
  }
  // remove season(s) with no local episode(s)
  show.seasons = show.seasons.filter(season => season.episodes.length > 0)
  return show
}

const getAllTVMetaData = async (tv_shows) => {
  var json = { tv: [] };
  console.log('Generating data for TV...')

  tv_shows = tv_shows || Object.entries(collection).filter(entry => entry[0].startsWith(process.env.TV_PATH));
  tv_shows.shift(); // remove the TV root directory entry

  for (let tv_show of tv_shows){
    try {
      json.tv.push(await getTVShowMetaData(tv_show));
    } catch(e) {
      console.log("There was a problem fetching metadata. Skipping this show", e)
      continue; // go next
    }
  }

  dbInsertMany("tv", json.tv)
}

const getUnknownAlbumMetaData = async (album_dir) => {
  let re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "Unknown Album";

  // build music album not on Spotify
  let album = {
    album_type: 'compilation',
    artists: [{ type: Artist.name, name: 'Unknown Artist', images: [{url: 'http://i.imgur.com/bVnx0IY.png'}] }],
    images: [{url: 'http://i.imgur.com/bVnx0IY.png'}],
    id: 'unknown',
    name: unknown_album,
    release_date: 'NaN',
    label: 'Unknown Label',
    tracks: {items:[]},
    type: Album.name
  }

  for (let [index, track_file] of album_dir[1].entries()) {
    console.log('GET: ' + track_file);

    let item = {}
    item.id = index
    item.name = track_file.replace(/.mp3|.flac/gi,'')
    item.disc_number = 1
    item.track_number = index + 1
    item.fs_path = `${album_dir[0]}/${track_file}`
    item.url_path = `/music/${album.id}/${item.disc_number}/${item.track_number}`
    item.duration_ms = await getAudioDurationInSeconds(item.fs_path) * 1000
    item.ctime = fs.statSync(item.fs_path).ctime
    item.mtime = fs.statSync(item.fs_path).mtime

    album.tracks.items.push(item)
  }

  album.tracks.local_total = album.tracks.items.filter(item => item.url_path != null).length
  album.tracks.total_duration_ms = findTotalDurationMillis(album.tracks.items)
  return album
}

const getAlbumMetaData = async (album_dir) => {
  let re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "Unknown Album";

  console.log('GET: ' + album_dir[0]);

  if (album_dir[0].toUpperCase().endsWith(unknown_album.toUpperCase())){
    return getUnknownAlbumMetaData(album_dir)
  }

  // find the Spotify music album
  let album = await metadataService.get(new Album({ id: album_dir[0].match(re)[1] }))
  // remove unnecessary Spotify json
  delete album.available_markets;
  album.tracks.items.map(item => {delete item.artists; delete item.available_markets});
  // find missing artist(s) information for the Spotify music album
  let artist = await metadataService.get(new Artist({ id: album.artists[0].id }))
  album.artists[0].images = artist.images
  album.artists[0].popularity = artist.popularity

  album_dir[1].forEach( (track_file) => {
    console.log('GET: ' + track_file);
    // for each song in the Spotify music album
    album.tracks.items.forEach( (item) => {
      // if local track found
      if ( (item.disc_number == parseInt(track_file.match(re2)[1] || 1) ) && 
        (item.track_number == parseInt(track_file.match(re2)[3]) ) ) {
        item.fs_path = `${album_dir[0]}/${track_file}`
        item.url_path = `/music/${album.id}/${item.disc_number}/${item.track_number}`
        item.ctime = fs.statSync(item.fs_path).ctime
        item.mtime = fs.statSync(item.fs_path).mtime
      }
    });
  });

  album.tracks.local_total = album.tracks.items.filter(item => item.url_path != null).length
  album.tracks.preview_total = album.tracks.items.filter(item => item.preview_url != null).length
  album.tracks.total_duration_ms = findTotalDurationMillis(album.tracks.items)
  return album
}

const getAllMusicMetaData = async (album_dirs) => {
  var json = { music: [] };
  console.log('Generating data for Music...')

  album_dirs = album_dirs || Object.entries(collection).filter(entry => entry[0].startsWith(process.env.MUSIC_PATH));
  album_dirs.shift(); // remove the Music root directory entry

  for (let album_dir of album_dirs) {
    try {
      json.music.push(await getAlbumMetaData(album_dir));
    } catch(e) {
      console.log("There was a problem fetching metadata. Skipping this album", e)
      continue; // go next
    }
  }

  dbInsertMany("music", json.music)
}

module.exports = { generateMetaData }