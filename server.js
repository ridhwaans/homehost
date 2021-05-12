var figlet = require('figlet');
var fs = require('fs');
var bluebird = require('bluebird');
var yaml = require('js-yaml');

const path = require('path');
const express = require('express');
const chokidar = require('chokidar');
const app = express();
const port = process.env.PORT || 5000;

var lib = require('./index.js');
var config = yaml.load(fs.readFileSync('./config.yml'));

var moviesClient = new lib.ApiClient(config.movies.api, config.movies.key, true);
var musicClient = new lib.ApiClient(config.music.api, config.music.key, true);
var tvClient = new lib.ApiClient(config.tv.api, config.tv.key, true);

var moviesData = require('./movies.json'); // or fs.readFileSync + JSON.parse()
var musicData =  require('./music.json'); 
var tvData =  require('./tv.json'); 

var files = [];
var watcher = chokidar.watch([config.movies.path, config.music.path, config.tv.path], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});
const log = console.log.bind(console);

watcher.on('ready', function() {
  log('Initial scan complete. Ready for changes');
  collection = watcher.getWatched();
  files = Object.entries(collection)
      .map(groups => groups
      .filter(group => typeof group == "object")
      .map(files => files
      .map(file => `${groups[0]}/${file}`))) // first entry will be the folder name to concatenate
      .flat(Infinity)
      .filter(x => !Object.keys(collection).includes(x));
  //console.table(files);
})

watcher
//.on('add', path => log(`File ${path} has been added`))
.on('change', path => log(`File ${path} has been changed`))
.on('unlink', path => log(`File ${path} has been removed`));

// Serve the static files from the React app
if (process.env.NODE_ENV == 'prod'){
  app.use(express.static(path.join(__dirname, 'client/public')));
}

app.get('/api/hello', (req, res) => {
  let hello = {homehost: 'Hello', config};
  res.json(hello);
});

app.get('/api/generate', (req, res) => {
  if (process.env.NODE_ENV == 'dev'){
    generateMetaData();
    res.json('Generating metadata. Please wait...');
  } else {
    res.json('Dev mode only')
  }
});

app.get('/api/movies', (req, res) => {
  res.json(moviesData.movies);
});

app.get('/api/music', (req, res) => {
  res.json(musicData.music)
});

app.get('/api/tv', (req, res) => {
  res.json(tvData.tv)
});

app.get('/api/movies/:id', function(req, res) {
  var movie = moviesData.movies.filter(movie => movie.id == parseInt(req.params.id));
  res.json(movie);
});

app.get('/api/music/albums/:id', function(req, res) {
  var album = musicData.music.filter(album => album.id == req.params.id);
  res.json(album);
});

app.get('/api/tv/seasons/:id', function(req, res) {
  var season = tvData.tv.filter(season => season.id == parseInt(req.params.id));
  res.json(season);
});

app.get('/music/:album_id/:disc_number/:track_number', function(req, res) {
  var track_fs_path = musicData.music.find(album => album.id == req.params.album_id)
    .tracks.items.filter(item => item.disc_number == parseInt(req.params.disc_number) && item.track_number == parseInt(req.params.track_number))
    .map(track => track.fs_path).toString();

  const path = track_fs_path
  const stat = fs.statSync(path)
  const head = {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
  }
  res.writeHead(200, head);
  fs.createReadStream(path).pipe(res);
});

app.get('/movies/:id', function(req, res) {
  var movie_fs_path = moviesData.movies
    .filter(movie => movie.id == parseInt(req.params.id))
    .map(movie => movie.fs_path).toString();
    
  const path = movie_fs_path
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }

});

// Handles any requests that don't match the ones above
if (process.env.NODE_ENV == 'prod'){
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/public/index.html'));
  });
}

var generateMetaData = function(){
  //generateMovieMetaData()
  //generateMusicMetaData()
  //generateTVMetaData()
  [generateMovieMetaData(), generateTVMetaData(), generateMusicMetaData()].forEach(async (metadata) => {
    await metadata;
  });
  console.log("Finished async");

};

const generateTVMetaData = async () => {
  let re = new RegExp(/(\d+)$/); // tv_id
        re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)
        json = { tv: [] };

  console.log('Generating data for TV...')

  let tv_shows = Object.keys(collection)
    .filter(group => typeof group == "string")
    .filter(group => group.startsWith(config.tv.path) && group != config.tv.path);

  await bluebird.mapSeries(tv_shows, async (tv_show) => {
    console.log('GET: ' + tv_show);
    // find tv show on TMDb
    let tv_id = parseInt(tv_show.match(re)[1])
    let show = await tvClient.send(new lib.requests.TVShow(tv_id), 250, null)
    show.seasons.forEach(function(season, i) {
      show.seasons[i].episodes = []
    });

    let episode_files = files.filter(x => x.startsWith(config.tv.path) && x.includes(tv_id))
    await bluebird.mapSeries(episode_files, async (episode_file) => {
      console.log('GET: ' + episode_file);
      // find tv episode on TMDb
      let season_number = parseInt(episode_file.match(re2)[1])
      let episode_number = parseInt(episode_file.match(re2)[2])
      try {
        let episode = await tvClient.send(new lib.requests.TVEpisode(tv_id, season_number, episode_number), 250, null)
        episode.fs_path = episode_file;
        episode.url_path = `http://localhost:${port}/tv/${tv_id}/${episode.season_number}/${episode.episode_number}`;

        let seasonIndex = show.seasons.findIndex(season => season.season_number == season_number.toString()); 
        show.seasons[seasonIndex].episodes.push(episode);
      } catch(e) {
        return true; // skip the episode if there is a problem fetching metadata
      }
    });
    json.tv.push(show);
  });

  fs.writeFile('./tv.json', JSON.stringify(json, 0, 4), 'utf8', (err)=>{
    if(err) console.log(err)
    else console.log('[TV] File saved');
  })
};

var generateMovieMetaData = function() {
  return new Promise(function(resolve, reject) {
  
  var re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id
      json = { movies: [] };

  console.log('Generating data for Movies...')
  
  bluebird.mapSeries(files.filter(x => x.startsWith(config.movies.path)), function(file){
  console.log('GET: ' + file);
  // find movie on TMDb
  return moviesClient.send(new lib.requests.Movie(file.match(re)[1]), 250, null)
    .then((movie) => {
    movie.fs_path = file;
    movie.url_path = `http://localhost:${port}/movies/${movie.id}`;
    json.movies.push(movie);
    });
  })
  .then(function(movies){
    fs.writeFile('./movies.json', JSON.stringify(json, 0, 4), 'utf8', (err)=>{
      if(err) console.log(err)
      else console.log('[MOVIES] File saved');
      resolve(json);
    })
  })
  .catch(function(err){
    console.log('Movie metadata could not be generated due to some error', err);
  });


  });
};

var generateMusicMetaData = function() {
  return new Promise(function(resolve, reject) {

  var re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      json = { music: [] };

  console.log('Generating data for Music...')

  let album_dirs = Object.keys(collection)
    .filter(group => typeof group == "string")
    .filter(group => group.startsWith(config.music.path) && group != config.music.path);
        
    bluebird.mapSeries(album_dirs, function(album_dir){
      console.log('GET: ' + album_dir);
      let track_files = [];

      if (album_dir.toUpperCase().endsWith("UNKNOWN ALBUM")){
        // build music album not on Spotify
        let album = {
          id: 'unknown',
          name: 'Unknown Album',
          artists: [{name: 'Various Artists'}],
          images: [{url: 'http://i.imgur.com/bVnx0IY.png'}],
          release_date: 'NaN',
          label: 'Various Labels',
          tracks: {items:[]}
        }
        track_files = files.filter(x => x.toUpperCase().includes("UNKNOWN ALBUM"))

        track_files.forEach( function( track_file, index ) {
          track = track_file.replace(/^.*[\\\/]/, ''); // get filename from full filepath
          console.log('GET: ' + track);

          let item = {}
          item.id = index
          item.name = track.replace(/.mp3|.flac/gi,'')
          item.disc_number = 1
          item.track_number = index + 1
          item.duration_ms = 'NaN'
          item.fs_path = track_file
          item.url_path = `http://localhost:${port}/music/${album.id}/${item.disc_number}/${item.track_number}`
          item.external_urls = {spotify: null}
          album.tracks.items.push(item)
        });

        json.music.push(album);
      } else {
        // find music album on Spotify
        return musicClient.send(new lib.requests.Album(album_dir.match(re)[1]), 50, null)
        .then((album) => {
          // remove unnecessary Spotify json
          delete album.available_markets;
          for(var i=0;i<album.tracks.items.length;i++){
            delete album.tracks.items[i].artists;
            delete album.tracks.items[i].available_markets;}

          track_files = files.filter(x => x.includes(album_dir.match(re)[1]))
          track_files.forEach( function( track_file, index ) {
              track = track_file.replace(/^.*[\\\/]/, ''); // get filename from full filepath
              console.log('GET: ' + track);
              
              // for each track in the Spotify music album
              album.tracks.items.forEach(function(item) {
                // if track found
                if ( (item.disc_number == parseInt(track.match(re2)[1] || 1) ) && 
                  (item.track_number == parseInt(track.match(re2)[3]) ) ) {
                  item.fs_path = track_file; 
                  item.url_path = `http://localhost:${port}/music/${album.id}/${item.disc_number}/${item.track_number}`;
                }
              });
            });

          json.music.push(album);
        });
      }
    }) // end of .mapSeries()
    .then(function(music){
      fs.writeFile('./music.json', JSON.stringify(json, 0, 4), 'utf8', (err)=>{
        if(err) console.log(err)
        else console.log('[MUSIC] File saved');
        resolve(json);
      })
    })
    .catch(function(err){
      console.log('Music metadata could not be generated due to some error', err);
    });
  });
};

console.log(figlet.textSync('homehost', 
  {
    font: 'Larry 3D',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }
));

app.listen(port, () => console.log(`Listening on port ${port}`));