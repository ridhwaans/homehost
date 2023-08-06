import express from 'express';
import { moviesController } from '../controllers';

export const moviesRouter = express.Router();

moviesRouter.get('/', moviesController.index);
moviesRouter.get('/:tmdb_id', moviesController.show);
moviesRouter.post('/', moviesController.create);
moviesRouter.patch('/:tmdb_id', moviesController.update);
moviesRouter.delete('/:tmdb_id', moviesController.delete);
