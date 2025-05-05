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
              // _id: user._id,
              role: user.role,
              fullname: user.fullname,
              email: user.email,
              usersname: user.usersname,
              phone: user.phone,
              address: user.address,
              sex: user.sex,
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

  async me(req: Request, res: Response): Promise<void> {
    try {
      // Lấy thông tin user từ req.user (do middleware xác thực gắn vào)
      const user = req.user;

      if (!user) {
        res.status(401).json({
          message:
            'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
        });
        return;
      }

      // Truy vấn thông tin user từ database dựa trên _id (nếu cần thiết)
      const userData = await Users.findById(user._id).select('-password -_id'); // Loại bỏ password và _id

      if (!userData) {
        res.status(404).json({ message: 'Người dùng không tồn tại' });
        return;
      }

      // Trả về thông tin user
      res.status(200).json({
        data: userData,
        status: 200,
        message: 'Lấy thông tin người dùng thành công',
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }

  async editAccount(req: Request, res: Response) {
    try {
      const user = req.user;
      const { usersname } = req.body;

      if (!user) {
        res.status(401).json({
          message:
            'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
        });
        return;
      }

      const userData = await Users.findByIdAndUpdate(
        { _id: user._id },
        { ...req.body },
        { new: true },
      ).select('-password -_id');
      if (!userData) {
        res.status(404).json({ message: 'Người dùng không tồn tại' });
        return;
      }
      return res.status(200).json({
        data: userData,
        status: 200,
        message: 'Cập nhật thông tin người dùng thành công',
      });
    } catch (error: any) {
      console.log(error);
    }
  }
}
