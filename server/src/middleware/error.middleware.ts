import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES } from '../config/constants';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: err.issues[0]?.message || 'Request validation failed.',
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || ERROR_CODES.INTERNAL_ERROR;

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: errorCode,
      message: err.message || 'Internal Server Error',
    },
  });
};
