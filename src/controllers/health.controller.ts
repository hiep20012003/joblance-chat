import { SuccessResponse } from '@hiep20012003/joblance-shared';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
export class HealthController {
  health = (_req: Request, res: Response, _next: NextFunction): void =>{
    new SuccessResponse({
      message: 'Chat service healthy',
      statusCode: StatusCodes.CREATED,
      reasonPhrase: ReasonPhrases.CREATED,
    }).send(res);
  };
}