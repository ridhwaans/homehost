import { Request, Response } from 'express';
import { OK } from '../constants/statusCodes';

class MoviesController {
  index = (req: Request, res: Response) => {
    res.status(OK);
    res.json({ status: OK });
  };
}

export const moviesController = new MoviesController();
