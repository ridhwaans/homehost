import path from 'path';
import express from 'express';
import cors from 'cors';

import figlet from 'figlet';
import bodyParser from 'body-parser';

import { fileWatcher } from './jobs';
import { NODE_ENV, PORT, PROD_ENV } from './constants';

fileWatcher();

const app = express();

if (NODE_ENV == PROD_ENV) {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(cors());

app.use(bodyParser.json());
app.use('/', require('./routes'));

console.log(figlet.textSync('homehost'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
