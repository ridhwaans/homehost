var yaml = require('js-yaml');
const express = require('express');

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
  generateMovieMetaData();

  res.json({ files: [] });
});

var generateMovieMetaData = function(){
  var fs = require('fs'),
      path = require('path');
      re = new RegExp(/(\d+)(.mp4|.mkv)$/);
      json = { movies: [] };

  let e = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
  files = walkSync(e.path, files)
  console.log('bump');
  files.forEach(function (file, i) {
    console.log(file + " " + file.match(re)[1]);
    // client.send(new tmdb.requests.Movie(file.match(re)[1]))
    // .then((movie) => {
    //   movie.file_path = e.path + '/' + file
    //   json.movies.push(movie);
    // })
    // .catch((error) => {
    //   console.error(error);
    //   // Use fallback
    // });
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