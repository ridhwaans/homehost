import multer from 'multer';
import { UPLOADE_DIR } from '../constants';
import { Request, Response, NextFunction } from 'express';

export const uploadService = multer({
  dest: UPLOADE_DIR,
  preservePath: true,
});

export const uploadVedio = uploadService.fields([{ name: 'vedioFile' }]);

export const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  uploadVedio(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      res
        .status(400)
        .json({ error: 'File upload error', message: err.message });
    } else if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      next();
    }
  });
};
