import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { NotAvailableModel, getAllMovies, getMovie } from '../db';
import { CREATED, NOT_FOUND, OK } from '../constants/statusCodes';
import { createMovieService, uploadVedio } from '../services';

class MoviesController extends BaseController {
  constructor() {
    super();
  }

  index = async (req: Request, res: Response) => {
    const movies = await getAllMovies();
    this.sendJson(req, res, OK, true, { movies });
  };

  show = async (req: Request, res: Response) => {
    const tmdb_id = parseInt(req.params.tmdb_id);
    if (tmdb_id) {
      const movie = await getMovie(tmdb_id);
      this.sendJson(req, res, OK, true, { movie });
    } else
      this.sendJson(req, res, NOT_FOUND, false, {
        error: 'Movie ID is not valid',
      });
  };

  create = async (req: Request, res: Response) => {
    const response = await createMovieService(req, res);
    console.log(response);
    this.sendJson(req, res, CREATED, true, response.data);
  };

  update = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#update' });
  };

  delete = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#delete' });
  };
}

export const moviesController = new MoviesController();
