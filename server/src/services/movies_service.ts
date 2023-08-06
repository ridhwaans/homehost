import { Request, Response } from 'express';
import { NotAvailableModel } from '../db';
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
  // console.log('fieldname', vedioFile.fieldname);
  // console.log('originalname', vedioFile.originalname);
  // console.log('destination', vedioFile.destination);
  // console.log('filename', vedioFile.filename);
  // console.log('path', vedioFile.path);
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
