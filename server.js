var _ = require('underscore');
var figlet = require('figlet');
var fs = require('fs');
var node_dir = require('node-dir');
var bluebird = require('bluebird');
var yaml = require('js-yaml');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

var lib = require('./index.js');
var config = yaml.safeLoad(fs.readFileSync('./config.yml'));

var moviesClient = new lib.ApiClient(config.movies.api, config.movies.key, true);
var musicClient = new lib.ApiClient(config.music.api, config.music.key, true);
var tvClient = new lib.ApiClient(config.tv.api, config.tv.key, true);

var moviesData = require('./movies.json');
var musicData = require('./music.json'); 
var tvData = require('./tv.json'); 

app.get('/api/hello', (req, res) => {
  let hello = { homehost: 'Hello', config};
  res.json(hello);
});

app.get('/api/generate', (req, res) => {
  generateMetaData();
  res.json('Generating metadata. Please wait...');
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
  var movie = _.where(moviesData.movies, {id: parseInt(req.params.id)});
  res.json(movie);
});

app.get('/api/music/albums/:id', function(req, res) {
  var album = _.where(musicData.music, {id: req.params.id});
  res.json(album);
});

app.get('/api/tv/seasons/:id', function(req, res) {
  var season = _.where(tvData.tv, {id: req.params.id});
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
  var movie_fs_path = _.where(moviesData.movies, {id: parseInt(req.params.id)}); // Get movie
  movie_fs_path = String(_.pluck(movie_fs_path, 'fs_path')); // Get movie.fs_path

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

var generateMetaData = function(){
  generateMusicMetaData()
    .then(function(result) { 
      return generateMovieMetaData();
    })
    .then(function(result) { 
      return generateTVMetaData();
    });
}

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

  fs.writeFile('./tv.json', JSON.stringify(json), 'utf8', (err)=>{
    if(err) console.log(err)
    else console.log('[TV] File saved');
  })
};


var generateMovieMetaData = function() {
  return new Promise(function(resolve, reject) {
  
  var re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id
      json = { movies: [] };

  console.log('Generating data for Movies...')
  node_dir.files(config.movies.path, function(err, files) {
    if (err) throw err;
    
    bluebird.mapSeries(files, function(file){
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
      fs.writeFile('./movies.json', JSON.stringify(json), 'utf8', (err)=>{
        if(err) console.log(err)
        else console.log('[MOVIES] File saved');
        resolve(json);
      })
    })
    .catch(function(err){
      console.log('Movie metadata could not be generated due to some error', err);
    });
  });

  });
};

var generateMusicMetaData = function() {
  return new Promise(function(resolve, reject) {

  var re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      json = { music: [] };

  console.log('Generating data for Music...')
  node_dir.subdirs(config.music.path, function(err, subdirs) {
    if (err) throw err;
    
    bluebird.mapSeries(subdirs, function(dir){
      console.log('GET: ' + dir);

      if (dir.toUpperCase().endsWith('UNKNOWN ALBUM')){
        let album = {
          id: 'unknown',
          name: 'Unknown Album',
          artists: [{name: 'Various Artists'}],
          images: [{url: 'http://i.imgur.com/bVnx0IY.png'}],
          release_date: 'NaN',
          label: 'Various Labels',
          tracks: {items:[]}
        }

        node_dir.files(dir, function(err, files) {
          files.forEach( function( file, index ) {
            file = file.replace(/^.*[\\\/]/, ''); // get filename from full filepath
            console.log('GET: ' + file);

            let item = {}
            item.id = index
            item.name = file.replace('.mp3','')
            item.disc_number = 1
            item.track_number = index + 1
            item.duration_ms = 'NaN'
            item.fs_path = dir + '/' + file
            item.url_path = ('http://localhost:' + port + '/music/').concat(album.id, '/', item.disc_number, '/', item.track_number)
            album.tracks.items.push(item)
          });
        });
        json.music.push(album);
      } else {
        // find music album on Spotify
        return musicClient.send(new lib.requests.Album(dir.match(re)[1]), 50, null)
        .then((album) => {
          // remove unnecessary Spotify json
          delete album.available_markets;
          for(var i=0;i<album.tracks.items.length;i++){
            delete album.tracks.items[i].artists;
            delete album.tracks.items[i].available_markets;}

          // for each track in the album
          node_dir.files(dir, function(err, files) {
            if(err) console.log(err)
            files.forEach( function( file, index ) {
              file = file.replace(/^.*[\\\/]/, ''); // get filename from full filepath
              console.log('GET: ' + file);
              
              album.tracks.items.forEach(function(item) {
                // if track found
                if ( (item.disc_number == parseInt(file.match(re2)[1] || 1) ) && 
                  (item.track_number == parseInt(file.match(re2)[3]) ) ) {
                  item.fs_path = dir + '/' + file; 
                  item.url_path = ('http://localhost:' + port + '/music/').concat(album.id, '/', item.disc_number, '/', item.track_number);
                }
              });
            });
          });
          json.music.push(album);
        });
      }
      //END mapSeries
    })
    .then(function(music){
      fs.writeFile('./music.json', JSON.stringify(json), 'utf8', (err)=>{
        if(err) console.log(err)
        else console.log('[MUSIC] File saved');
        resolve(json);
      })
    })
    .catch(function(err){
      console.log('Music metadata could not be generated due to some error', err);
    });
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