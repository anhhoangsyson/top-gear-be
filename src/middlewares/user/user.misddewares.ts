import { RequestHandler } from 'express';
import { IUser } from '../../api/users/dto/users.dto';

const checkrole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const possibleUser = req.user as unknown;
    // narrow and validate
    if (
      possibleUser &&
      typeof possibleUser === 'object' &&
      'role' in (possibleUser as any)
    ) {
      const user = possibleUser as IUser;
      if (user && roles.includes(user.role)) {
        return next();
      }
    }
    res
      .status(403)
      .json({ message: 'bạn không đúng role nên không thể đăng nhập' });
    return;
  };
};

export default checkrole;
