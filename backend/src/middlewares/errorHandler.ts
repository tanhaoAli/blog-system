import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]: ', err.stack);

  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
    }
  });
};