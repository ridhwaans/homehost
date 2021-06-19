const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const { Album, Artist, Movie, TVEpisode, TVShow } = require('../models');
const { findTotalDurationMillis } = require('../utils');
const metadataService = require('../services/metadata');
const DATA_PATH = path.resolve(__dirname,'../data');

var watcher = chokidar.watch([process.env.MOVIES_PATH, process.env.TV_PATH, process.env.MUSIC_PATH], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

watcher.on('ready', () => {
  console.log('Initial scan complete. Ready for changes')
  collection = watcher.getWatched()
})

watcher
.on('add', path => console.log(`File ${path} has been added`))
.on('change', path => console.log(`File ${path} has been changed`))
.on('unlink', path => console.log(`File ${path} has been removed`))

module.exports = {
  generateMetaData: (filter = ["movies", "tv", "music"]) => {
    let jobs = []
    filter.map(media => {
      if (media == "movies") jobs.push(generateMovieMetaData)
      if (media == "tv") jobs.push(generateTVMetaData)
      if (media == "music") jobs.push(generateMusicMetaData)
    })
    jobs.reduce((p, fn) => p.then(fn), Promise.resolve())
  }
}

const generateMovieMetaData = async () => {
  let re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id
  var json = { movies: [] };

  console.log('Generating data for Movies...')
  
  let movies = Object.entries(collection).filter(entry => entry[0].startsWith(process.env.MOVIES_PATH));
  movies = movies.map(folder => folder[1]
    .map(file => `${folder[0]}/${file}`))
    .flat(Infinity)
    .filter(file => !movies.map(folder => folder[0]).includes(file)) // remove paths ending with subdirectories from list

    for (let file of movies){
      try {
        console.log('GET: ' + file);
        const movie = await new metadataService().get(new Movie({ id: file.match(re)[1] }))
        movie.fs_path = file;
        movie.url_path = `/movies/${movie.id}`;
        movie.ctime = fs.statSync(movie.fs_path).ctime;
        movie.mtime = fs.statSync(movie.fs_path).mtime;

        json.movies.push(movie);
      } catch(e) {
        console.log("There was a problem fetching metadata. Skipping this movie", e)
        continue; // go next
      }
    }

  fs.writeFile(`${DATA_PATH}/movies.json`, JSON.stringify(json, 0, 4), 'utf8', (err)=>{
    if(err) console.log(err)
    else console.log('[MOVIES] File saved');
  })
}

const generateTVMetaData = async () => {
  let re = new RegExp(/(\d+)$/); // tv_id
      re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)
  var json = { tv: [] };

  console.log('Generating data for TV...')

  let tv_shows = Object.entries(collection).filter(entry => entry[0].startsWith(process.env.TV_PATH));
  tv_shows.shift(); // remove the TV root directory entry

  for (let tv_show of tv_shows){
    console.log('GET: ' + tv_show[0]);
    // find tv show on TMDb
    let tv_id = parseInt(tv_show[0].match(re)[1])
    let show = await new metadataService().get(new TVShow({ id: tv_id }))
    show.seasons.map(season => season.episodes = [])

    for (let episode_file of tv_show[1]) {
      console.log('GET: ' + episode_file);
      // find tv episode on TMDb
      let season_number = parseInt(episode_file.match(re2)[1])
      let episode_number = parseInt(episode_file.match(re2)[2])
      try {
        let episode = await new metadataService().get(new TVEpisode({ tv_id: tv_id, season_number: season_number, episode_number: episode_number }))
        episode.fs_path = `${tv_show[0]}/${episode_file}`;
        episode.url_path = `/tv/${tv_id}/${episode.season_number}/${episode.episode_number}`;
        episode.ctime = fs.statSync(episode.fs_path).ctime;
        episode.mtime = fs.statSync(episode.fs_path).mtime;

        let seasonIndex = show.seasons.findIndex(season => season.season_number == season_number.toString()); 
        show.seasons[seasonIndex].episodes.push(episode);
      } catch(e) {
        console.log("There was a problem fetching metadata. Skipping this episode", e)
        continue; // go next
      }
    }
    // remove season(s) with no local episode(s)
    show.seasons = show.seasons.filter(season => season.episodes.length > 0)
    json.tv.push(show);
  }

  fs.writeFile(`${DATA_PATH}/tv.json`, JSON.stringify(json, 0, 4), 'utf8', (err)=>{
    if(err) console.log(err)
    else console.log('[TV] File saved');
  })
}

const generateMusicMetaData = async () => {
  let re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "Unknown Album";
  var json = { music: [] };

  console.log('Generating data for Music...')

  let album_dirs = Object.entries(collection).filter(entry => entry[0].startsWith(process.env.MUSIC_PATH));
    album_dirs.shift(); // remove the Music root directory entry

    for (let album_dir of album_dirs) {
      console.log('GET: ' + album_dir[0]);

      if (album_dir[0].toUpperCase().endsWith(unknown_album.toUpperCase())){
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
        json.music.push(album);
        continue; // go next
      }
      
      try {
        // find the Spotify music album
        let album = await new metadataService().get(new Album({ id: album_dir[0].match(re)[1] }))
        // remove unnecessary Spotify json
        delete album.available_markets;
        album.tracks.items.map(item => {delete item.artists; delete item.available_markets});
        // find missing artist(s) information for the Spotify music album
        let artist = await new metadataService().get(new Artist({ id: album.artists[0].id }))
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
        json.music.push(album);

      } catch(e) {
        console.log("There was a problem fetching metadata. Skipping this album", e)
        continue; // go next
      }
    }

    fs.writeFile(`${DATA_PATH}/music.json`, JSON.stringify(json, 0, 4), 'utf8', (err)=>{
      if(err) console.log(err)
      else console.log('[MUSIC] File saved');
    })
}