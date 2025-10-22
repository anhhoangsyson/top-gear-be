import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

export const validateRegister: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    fullname: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    usersname: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  next();
};

export const validateUpdateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    usersname: Joi.string().alphanum().min(3).max(30),
    phone: Joi.number(),
    address: Joi.string(),
    sex: Joi.string().valid('male', 'female', 'other'),
    avatar: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
