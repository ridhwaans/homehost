const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/movies', (req, res) => {
  var fs = require('fs'),
      path = require('path');
  let files = fs.readdirSync('/Users/ridhwaans/Downloads/submission');
  console.log("files: " + files);
  res.json({ files: files }); //'teststring'
});

app.listen(port, () => console.log(`Listening on port ${port}`));