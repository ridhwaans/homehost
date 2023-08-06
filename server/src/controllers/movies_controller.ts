import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { CREATED, OK } from '../constants/statusCodes';

class MoviesController extends BaseController {
  constructor() {
    super();
  }
  index = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#index' });
  };
  show = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#show' });
  };
  create = (req: Request, res: Response) => {
    this.sendJson(req, res, CREATED, true, { from: 'MoviesController#create' });
  };
  update = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#update' });
  };
  delete = (req: Request, res: Response) => {
    this.sendJson(req, res, OK, true, { from: 'MoviesController#delete' });
  };
}

export const moviesController = new MoviesController();
