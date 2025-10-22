import { Users } from '../../users/schema/user.schema';
import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { IUser, RegisterUserDto } from '../../users/dto/users.dto';
import connectRedis from '../../../config/redis/redis.config';
import {
  getAccessToken,
  getRefreshToken,
} from '../../../middlewares/token/createToken';
import { roleUsers } from '../../../constants/users/role/role_users.constants';

export class authController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { fullname, email, password, usersname }: RegisterUserDto =
        req.body;

      // kiem tra email da co hay chua
      const existingEmail = await Users.findOne({ email });
      if (existingEmail) {
        res.status(400).json({ message: 'Email đã tồn tại' });
        return;
      }
      // kiem tra user name da co hay chua
      const existingUsersName = await Users.findOne({ usersname });
      if (existingUsersName) {
        res.status(400).json({ message: 'usersName đã tồn tại' });
        return;
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // create new user with hashed password
      const newUser = new Users({
        fullname,
        email,
        usersname,
        password: hashPassword,
        role: roleUsers.USERS,
        authType: 'local',
        profileCompleted: false,
      });

      await newUser.save();
      // const result = await Users.create(newuser);

      const redisClient = connectRedis();
      const accessToken = getAccessToken(newUser._id, newUser.role);
      const refreshToken = getRefreshToken(newUser._id, newUser.role);

      await redisClient.set(newUser._id.toString(), refreshToken);
      res.status(201).json({
        message: 'Tạo tài khoản thành công',
        token: accessToken,
        refreshToken: refreshToken,
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          role: newUser.role,
          profileCompleted: newUser.profileCompleted,
        },
        status: 201,
      });
    } catch (error: any) {
      next(error);
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
            const refreshToken = getAccessToken(user._id, user.role);
            const redisClient = connectRedis();
            await redisClient.set(
              user._id.toString(),
              refreshToken,
              'EX',
              70 * 24 * 60 * 60,
            );
            const userData = {
              token: accesstoken,
              RefreshToken: refreshToken,
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

  async facebookAuth(req: Request, res: Response, next: NextFunction) {
    // passport.authenticate('facebook', { session: true })(req, res, next);
    try {
      const { provider, providerId, email, image, accessToken, profile } =
        req.body;

      if (!providerId || !provider || !email || !accessToken) {
        return res.status(400).json({
          message: 'Thiếu thông tin đăng nhập từ Facebook',
        });
      }

      let user = await Users.findOne({ 'socialAuth.providerId': providerId });

      if (!user) {
        user = new Users({
          fullname: profile.name,
          email: email,
          usersname: profile.name,
          avatar: image,
          authType: 'facebook',
          socialAuth: [
            {
              provider: provider,
              providerId: providerId,
              accessToken: accessToken,
              profile: profile,
              lastLogin: new Date(),
            },
          ],
        });
      }

      await user.save();

      // Tạo accessToken và refreshToken
      const accessJWT = getAccessToken(user._id, user.role);
      console.log('accessJWT', accessJWT);

      const refreshJWT = getRefreshToken(user._id, user.role);
      const redisClient = connectRedis();
      await redisClient.set(
        user._id.toString(),
        refreshJWT,
        'EX',
        70 * 24 * 60 * 60,
      );

      res.status(200).json({
        success: true,
        message: 'Tạo tài khoản thành công',
        accessToken: accessJWT,
        refreshToken: refreshJWT,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted,
        },
        status: 201,
      });

      return true;
    } catch (error) {
      next(error);
    }

    //  res.status(200).json({
    //   success: true,
    // })
    // return true
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }
}

// <script>
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '{your-app-id}',
//       cookie     : true,
//       xfbml      : true,
//       version    : '{api-version}'
//     });

//     FB.AppEvents.logPageView();

//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
// </script>
