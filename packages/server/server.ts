import path from 'path';
import express from 'express';
import cors from 'cors';

import figlet from 'figlet';
import bodyParser from 'body-parser';
import { configDotenv } from 'dotenv';

const app = express();
const port = process.env.PORT || 5000;
import { fileWatcher } from './jobs';
configDotenv();

fileWatcher();

if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(cors());

app.use(bodyParser.json());
app.use('/', require('./routes'));

console.log(figlet.textSync('homehost'));
app.listen(port, () => console.log(`Listening on port ${port}`));
