import { Request, Response, NextFunction } from 'express';

export function notFoundErrorMiddleware(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Resource not found',
  });
}
