import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateDto = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
    next();
  };
};
