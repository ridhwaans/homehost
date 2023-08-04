import express from 'express';
import { moviesController } from '../controllers';

export const moviesRouter = express.Router();

moviesRouter.get('/', moviesController.index);
