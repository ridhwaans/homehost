const path = require('path');
const cors = require('cors');
const express = require('express');
const figlet = require('figlet');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// CORS
app.use(cors());

// Serve the static files from the React app
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Include routes
app.use(bodyParser.json());
app.use('/', require('./api'));

console.log(figlet.textSync('homehost'));
app.listen(port, () => console.log(`Listening on port ${port}`));
