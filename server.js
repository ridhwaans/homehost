var _ = require('underscore');
var fs = require('fs');
var dir = require('node-dir');
var bluebird = require('bluebird');
var yaml = require('js-yaml');
var config = yaml.safeLoad(fs.readFileSync('./config.yml'));

const express = require('express');
const app = express();

var lib = require('./index.js');
var moviesClient = new lib.ApiClient(
    config.movies.api, 
    config.movies.key, 
    true);

var musicClient = new lib.ApiClient(
    config.music.api, 
    null, 
    true, 
    {
      headers: {'Authorization': 'Bearer ' + config.music.key}
    });

var movies = require('./movies.json');
var music = require('./music.json'); // TODO append to metadata.json
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  let hello = { homehost: 'Hello', config};
  res.json(hello);
});

app.get('/api/movies', (req, res) => {
  //generateMovieMetaData(); //one-off script
  res.json(movies.movies);
});

app.get('/api/music', (req, res) => {
  //generateMusicMetaData(); //one-off script
  res.json(music.music)
});

app.get('/api/movies/:id', function(req, res) {
  var movie = _.where(movies.movies, {id: parseInt(req.params.id)});
  res.json(movie);
});

app.get('/api/music/albums/:id', function(req, res) {
  var album = _.where(music.music, {id: req.params.id});
  res.json(album);
});

app.get('/music/albums/:album_id/tracks/:track_number', function(req, res) {
  var track_fs_path = _.where(music.music, {id: req.params.album_id}); // Get album
  track_fs_path = String(_.pluck(movie_fs_path, 'preview_url')); // Get album.tracks.items.preview_url
  // TODO
  res.json(album);
});



app.get('/movies/:id', function(req, res) {
  var movie_fs_path = _.where(movies.movies, {id: parseInt(req.params.id)}); // Get movie
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

var generateMovieMetaData = function(){
  var re = new RegExp(/(\d+)(.mp4|.mkv)$/);
      json = { movies: [] };

  dir.files(config.movies.path, function(err, files) {
    if (err) throw err;
    
    bluebird.mapSeries(files, function(file){
    console.log('GET: ' + file);
    return moviesClient.send(new lib.requests.Movie(file.match(re)[1]), 250, null)
           .then((movie) => {
           movie.fs_path = file;
           movie.url_path = 'http://localhost:' + port + '/movies/' + movie['id'];
           json.movies.push(movie);
           });
    })
    .then(function(movies){
      fs.writeFile('./movies.json', JSON.stringify(json), 'utf8', (err)=>{
         if(err) console.log(err)
         else console.log('File saved')
      })

      return json;
    })
    .catch(function(err){
      console.log("Movie metadata could not be generated due to some error", err);
    });

  });

};

var generateMusicMetaData = function(){
  var re = new RegExp(/(\w+)$/);
      re2 = new RegExp(/([0-9]+).*/);
      json = { music: [] };

  dir.subdirs(config.music.path, function(err, subdirs) {
    if (err) throw err;
    
    bluebird.mapSeries(subdirs, function(dir){
    console.log('GET: ' + dir);
    return musicClient.send(new lib.requests.Album(dir.match(re)[1]), 50, null)
           .then((album) => {
           album.url_path = 'http://localhost:' + port + '/albums/' + album['id'];

          // fs.readdir( dir, function( err, files ) {
          //   if(err) console.log(err)
          //   files.forEach( function( file, index ) {
          //     let track_number = file.match(re2)[1]);

          //   });
          // });

           json.music.push(album);
           });
    })
    .then(function(music){
      fs.writeFile('./music.json', JSON.stringify(json), 'utf8', (err)=>{
         if(err) console.log(err)
         else console.log('File saved')
      })

      return json;
    })
    .catch(function(err){
      console.log("Album metadata could not be generated due to some error", err);
    });

  });

};

var generateMetaData = function(){
  // TODO
  // generateMovieMetaData
  // generateMusicMetaData
}

app.listen(port, () => console.log(`Listening on port ${port}`));