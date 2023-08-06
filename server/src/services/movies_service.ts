import {Request, Response} from "express";
import { NotAvailableModel } from '../db';
import {MOVIE} from "../constants"

export const createMovieService = async (req: Request, res: Response) => {
  const {title, imdb_id} = req.params;

  if()

  const notAvailableObj = NotAvailableModel.create({
    data: { title, imdb_id, type: MOVIE, fs_path: },
  });
};
