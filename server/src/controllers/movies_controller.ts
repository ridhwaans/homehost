import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { OK } from '../constants/statusCodes';

class MoviesController extends BaseController {
  constructor() {
    super();
  }
  index = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#index' });
  };
}

export const moviesController = new MoviesController();
