import express from 'express';
import { moviesController } from '../controllers';
import { handleFileUpload } from '../services';

export const moviesRouter = express.Router();

moviesRouter.get('/', moviesController.index);
moviesRouter.get('/:tmdb_id', moviesController.show);
moviesRouter.post('/', handleFileUpload, moviesController.create);
moviesRouter.patch('/:tmdb_id', moviesController.update);
moviesRouter.delete('/:tmdb_id', moviesController.delete);
