import { Request, Response } from 'express';
import { MoviesModel, NotAvailableModel, getMovie } from '../db';
import { uploadVedio } from './multer';
import { ServiceReturnType } from '../types';
import { MOVIE, UPLOADE_DIR } from '../constants';
import path from 'path';
// import { MOVIE } from '../constants';

export const createMovieService = async (
  req: Request,
  res: Response
): Promise<ServiceReturnType> => {
  let response: ServiceReturnType = { success: true, error: {}, data: {} };
  const vedioFile = (req.files as any)['vedioFile'][0];
  const { title, imdb_id } = req.body;
  console.log(title);
  console.log(imdb_id);
  const obj = await NotAvailableModel.create({
    data: {
      fs_path: path.join(UPLOADE_DIR, vedioFile.filename),
      type: MOVIE,
      title,
      imdb_id,
    },
  });
  response.data = obj;
  return response;
};

export const updateMovieService = async (
  req: Request,
  res: Response
): Promise<ServiceReturnType> => {
  let response: ServiceReturnType = { success: true, error: {}, data: {} };
  const { title, tmdb_id } = req.params;
  if (!title) {
    response.success = false;
    response.error['title'] = 'movie title is required';
    return response;
  }
  if (!tmdb_id) {
    response.success = false;
    response.error['tmdb_id'] = 'movie tmdb_id is required';
    return response;
  }
  if (!parseInt(tmdb_id)) {
    response.success = false;
    response.error['tmdb_id'] = 'movie tmdb_id is not valid';
    return response;
  }
  const movie = await getMovie(parseInt(tmdb_id));
  return response;
};
