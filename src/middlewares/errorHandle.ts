import { Request, Response, NextFunction } from 'express';
import ApiError from '../utilts/apiError';

interface MongooseError extends Error {
  code?: number;
  errors?: { [key: string]: { message: string } };
}

// Middleware xử lý lỗi
const errorHandler = (
  err: MongooseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  // Log lỗi
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ApiError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ApiError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(message.join(', '), 400);
  }

  res.status((error as ApiError).statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
