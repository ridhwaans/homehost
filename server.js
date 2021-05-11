var _ = require('underscore');
var figlet = require('figlet');
var fs = require('fs');
var node_dir = require('node-dir');
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
      .map(file => groups[0] + "/" + file))) // first entry will be the folder name to concatenate
      .flat().flat()
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
  var album = musicData.music.filter(album => album.id == parseInt(req.params.id));
  res.json(album);
});

app.get('/api/tv/seasons/:id', function(req, res) {
  var season = tvData.tv.filter(season => season.id == parseInt(req.params.id));
  res.json(season);
});

app.get('/music/:album_id/:disc_number/:track_number', function(req, res) {
  var album = _.find(musicData.music, {id: req.params.album_id}); // Get albums
  var track_fs_path = _.where(album.tracks.items, {disc_number: parseInt(req.params.disc_number), track_number: parseInt(req.params.track_number)}); // Get track
  track_fs_path = String(_.pluck(track_fs_path, 'fs_path')); // Get track.fs_path

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
    .map(movie => movie['fs_path'])
    .toString();
    
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
  //generateMusicMetaData()
  //generateTVMetaData()
  [generateMovieMetaData()].forEach(async (metadata) => {
    await metadata;
  });
  console.log("Finished async");

};

const generateTVMetaData = async () => {
  let re = new RegExp(/(\d+)$/); // tv_id
        re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)
        json = { tv: [] };

  console.log('Generating data for TV...')
  let subdirs = await new Promise((resolveSubdirs) => {
    node_dir.subdirs(config.tv.path, async (err, subdirs) => {
      if (err) throw err;
      resolveSubdirs(subdirs);
    });
  });

  await bluebird.mapSeries(subdirs, async (subdir) => {
    console.log('GET: ' + subdir);
    // find tv show on TMDb
    let tv_id = parseInt(subdir.match(re)[1])
    let show = await tvClient.send(new lib.requests.TVShow(tv_id), 250, null)
    show.seasons.forEach(function(season, i) {
      show.seasons[i].episodes = []
    });

    let files = await new Promise((resolveFiles) => {
      node_dir.files(subdir, (err, files) => {
        if (err) throw err;
        resolveFiles(files);
      });
    });

    await bluebird.mapSeries(files, async (file) => {
      console.log('GET: ' + file);
      // find tv episode on TMDb
      let season_number = parseInt(file.match(re2)[1])
      let episode_number = parseInt(file.match(re2)[2])
      
      let episode = await tvClient.send(new lib.requests.TVEpisode(tv_id, season_number, episode_number), 250, null)
      episode.fs_path = file;
      episode.url_path = ('http://localhost:' + port + '/tv/').concat(tv_id, '/', episode.season_number, '/', episode.episode_number);

      let seasonIndex = _.findIndex(show.seasons, { season_number: season_number });
      show.seasons[seasonIndex].episodes.push(episode);
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
    movie.url_path = 'http://localhost:' + port + '/movies/' + movie.id;
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
};

console.log(figlet.textSync('homehost', 
  {
    font: 'Larry 3D',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }
));

app.listen(port, () => console.log(`Listening on port ${port}`));