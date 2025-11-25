import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
export class HealthController {
  health = (_req: Request, res: Response, _next: NextFunction): void =>{
    res.status(StatusCodes.OK).send('Chat Service is healthy and OK');
  };
}