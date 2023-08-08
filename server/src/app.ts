import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import bodyParser from 'body-parser';
import { NODE_ENV, PROD_ENV } from './constants';
import { moviesRouter } from './routes';
import morgan from 'morgan';

export const app = express();

if (NODE_ENV == PROD_ENV) {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/movies', moviesRouter);
