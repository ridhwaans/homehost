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
  files = fs.readdirSync(e.path);
  res.json({ files: files });
});

function fetchMetadata(){

}

app.listen(port, () => console.log(`Listening on port ${port}`));