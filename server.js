var _ = require('underscore');
var figlet = require('figlet');
var fs = require('fs');
var node_dir = require('node-dir');
var bluebird = require('bluebird');
var yaml = require('js-yaml');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

var moviesData = require('./movies.json');
var musicData = require('./music.json'); 
var tvData = require('./tv.json'); 

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
  //var movie_fs_path = _.where(moviesData.movies, {id: parseInt(req.params.id)}); // Get movie
  //movie_fs_path = String(_.pluck(movie_fs_path, 'fs_path')); // Get movie.fs_path
  movie_fs_path = "./stock.mp4";
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

console.log(figlet.textSync('homehost', 
  {
    font: 'Larry 3D',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }
));

app.listen(port, () => console.log(`Listening on port ${port}`));