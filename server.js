var yaml = require('js-yaml');
var request = require('request');
var cache = require('memory-cache');
var tnp = require('torrent-name-parser');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

var files = [];

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/movies', (req, res) => {
  var fs = require('fs'),
      path = require('path');
      
  let e = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
  //files = fs.readdirSync(e.path);
  files = walkSync(e.path, files)
  files.forEach(function (file, i) {
    files[i] = tnp(file).title
	});
  res.json({ files: files });
});

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