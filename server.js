const express = require('express');
var movies = require('./movies.json');

var _ = require('underscore');
var fs = require('fs');
var yaml = require('js-yaml');

const app = express();
const port = process.env.PORT || 5000;

var files = [];
//var tmdb = require('/lib/api-client.js');

var tmdb = require('./index.js');
var client = new tmdb.ApiClient('api.themoviedb.org/3','129c09bb93839f3653b2510e55744d9f', true);


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/movies', (req, res) => {
  //generateMovieMetaData(); one-off script
  res.json(movies.movies);
});

app.get('/api/movies/:id', function(req, res) {
  var movie = _.where(movies.movies, {id: parseInt(req.params.id)});
  res.json(movie);
});


app.get('/movies/:id', function(req, res) {
  var movie_file_path = _.where(movies.movies, {id: parseInt(req.params.id)}); // Get movie
  movie_file_path = _.pluck(movie_file_path, 'file_path'); // Get movie.file_path
  
  const path = String(movie_file_path)
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
  var path = require('path');
      bluebird = require('bluebird');
      re = new RegExp(/(\d+)(.mp4|.mkv)$/);
      json = { movies: [] };

  let e = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
  files = walkSync(e.path, files)

  bluebird.mapSeries(files, function(file){
    return client.send(new tmdb.requests.Movie(file.match(re)[1]), 250, null)
           .then((movie) => {
           console.log(e.path + '/' + file);
           movie.file_path = e.path + '/' + file
           json.movies.push(movie);
           });
  })
  .then(function(movies){
    fs.writeFile('./movies.json', JSON.stringify(json), 'utf8', null);
    return json;
  })
  .catch(function(err){
    console.log("Movie metadata could not be generated due to some error", err);
  });
};

var walkSync = function(dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(file);
    }
  });
  return filelist;
};

app.listen(port, () => console.log(`Listening on port ${port}`));