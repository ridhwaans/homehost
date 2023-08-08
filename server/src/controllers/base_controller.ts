import { Response, Request } from 'express';

export class BaseController {
  constructor() {}
  sendJson = (
    req: Request,
    res: Response,
    status: number,
    success: boolean,
    data?: any
  ) => {
    res.status(status);
    res.json({ status, success, data });
  };
}
