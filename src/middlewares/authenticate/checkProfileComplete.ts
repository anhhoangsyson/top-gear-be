import { Request, Response, NextFunction } from 'express';
import { Users } from '../../api/users/schema/user.schema';

export const requireCompleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user._id;
    const user = await Users.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
      return;
    }

    if (!user.profileCompleted) {
      res.status(403).json({
        message: 'Vui lòng hoàn thành hồ sơ của bạn trước khi tiếp tục',
        profileCompleted: false,
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Check profile complete error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
