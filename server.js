var yaml = require('js-yaml');
const express = require('express');
var movies = require('./movies.json');

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
  //generateMovieMetaData();
  res.json(movies.movies);
});

var generateMovieMetaData = function(){
  var fs = require('fs');
      path = require('path');
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
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
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