import { Request, Response, NextFunction } from 'express';

export function internalServerErrorMiddleware(_req: Request, res: Response, _next: NextFunction) {
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error: Unexpected server failure',
  });
}
