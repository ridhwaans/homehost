import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { getAllMovies, getMovie } from '../db';
import { CREATED, NOT_FOUND, OK } from '../constants/statusCodes';

class MoviesController extends BaseController {
  constructor() {
    super();
  }
  index = (req: Request, res: Response) => {
    const movies = getAllMovies();
    this.sendJson(req, res, OK, true, { movies });
  };

  show = (req: Request, res: Response) => {
    const tmdb_id = parseInt(req.params.tmdb_id);
    if (tmdb_id) {
      const movie = getMovie(tmdb_id);
      this.sendJson(req, res, OK, true, { movie });
    } else
      this.sendJson(req, res, NOT_FOUND, false, {
        error: 'Movie ID is not valid',
      });
  };

  create = (req: Request, res: Response) => {
    const { title, imdb_id } = req.params;
    if (title && imdb_id) {
    }
    this.sendJson(req, res, CREATED, true, {
      from: 'MoviesController#create',
    });
  };

  update = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#update' });
  };

  delete = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#delete' });
  };
}

export const moviesController = new MoviesController();
