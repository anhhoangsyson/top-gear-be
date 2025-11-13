import { Request, Response, NextFunction } from 'express';
import { roleUsers } from '../../constants/users/role/role_users.constants';

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (
    req.user.role !== roleUsers.ADMIN &&
    req.user.role !== roleUsers.MANAGER
  ) {
    res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    return;
  }

  next();
};

export default checkAdmin;
