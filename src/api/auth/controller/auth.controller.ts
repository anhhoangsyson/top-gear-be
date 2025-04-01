import { Users } from '../../users/schema/user.schema';
import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { IUser } from '../../users/dto/users.dto';
import connectRedis from '../../../config/redis/redis.config';
import { getAccessToken } from '../../../middlewares/token/createToken';

export class authController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, usersname } = req.body;
      const Email = await Users.findOne({ email });
      if (Email) {
        res.status(400).json({ message: 'Email đã tồn tại' });
        return;
      }
      const usersName = await Users.findOne({ usersname });
      if (usersName) {
        res.status(400).json({ message: 'usersName đã tồn tại' });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newuser = {
        ...req.body,
        password: hashPassword,
      };
      const result = await Users.create(newuser);
      res.status(201).json({ data: result, status: 201 });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate(
      'local',
      { session: false },
      (err: any, user: IUser | undefined, info: any) => {
        if (err) {
          return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
        }
        if (!user) {
          return res
            .status(401)
            .json({ message: 'Thông tin đăng nhập không hợp lệ' });
        }
        req.login(user, { session: false }, async (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: 'Lỗi đăng nhập không thành công' });
          }
          try {
            const accesstoken = getAccessToken(user._id, user.role);
            const Refresh = getAccessToken(user._id, user.role);
            const redisClient = connectRedis();
            await redisClient.set(
              user._id.toString(),
              Refresh,
              'EX',
              70 * 24 * 60 * 60,
            );
            const userData = {
              token: accesstoken,
              RefreshToken: Refresh,
              ...user,
            };
            return res.json({
              data: userData,
              status: 200,
              message: 'dang nhap thanh cong',
            });
          } catch (error: any) {
            res
              .status(500)
              .json({ message: error.message || 'Internal server error' });
          }
        });
      },
    )(req, res, next);
  }
}
