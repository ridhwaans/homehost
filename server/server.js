const path = require('path');
const express = require('express');
const figlet = require('figlet');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// Serve the static files from the React app
if (process.env.NODE_ENV == 'prod'){
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_BASE_URL); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Include routes
app.use(bodyParser.json());
app.use('/', require('./routes'));

console.log(figlet.textSync('homehost'));
app.listen(port, () => console.log(`Listening on port ${port}`));

console.log(`Current NODE_ENV is ${process.env.NODE_ENV}`);
console.log(`Current DATABASE_URL is ${process.env.DATABASE_URL}`)