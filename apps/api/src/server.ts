import * as path from 'path';
import express from 'express';

import figlet from "figlet"
import bodyParser from "body-parser"

import { z } from 'zod';

import * as env from 'dotenv';
env.config();

const environmentVariablesSchema = z.object({
  TMDB_KEY: z.coerce.string(),
  SPOTIFY_CLIENT_ID: z.coerce.string(),
  SPOTIFY_CLIENT_SECRET: z.coerce.string(),
  MOVIES_PATH: z.coerce.string(),
  TV_PATH: z.coerce.string(),
  MUSIC_PATH: z.coerce.string(),
  DATABASE_URL: z.coerce.string().startsWith("file:"),
  CLIENT_BASE_URL: z.coerce.string().default('http://localhost:3000'),
  DISABLE_SYNC: z.coerce.boolean().default(false),
});

export const getEnvironmentVariables = () => {
  try {
    return environmentVariablesSchema.strip().parse(process.env);
  } catch (err) {
    throw (err);
  }
};

const app = express();
const port = process.env.PORT || 5000;


require('./jobs').fileWatcher();

// Serve the static files from the React app
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_BASE_URL); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Include routes
app.use(bodyParser.json());
app.use('/', require('./routes'));

console.log(figlet.textSync('homehost'));
app.listen(port, () => console.log(`Listening on port ${port}`));
