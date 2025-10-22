import { Request, Response } from 'express';
import { UsersService } from '../service/users.service';
import { UpdateUserDto } from '../dto/users.dto';
import { Users } from '../schema/user.schema';

const usersService = new UsersService();
export class UsersController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await usersService.getAllUsers();
      res.status(200).json({
        data: users,
        length: users.length,
        massage: 'Get all users successfully',
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  async createUsers(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const users = await usersService.createUsers(body);
      res.status(201).json({
        data: users,
        message: 'create users successfully ',
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }

  async getUsersById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const user = await usersService.getUserById(id);
      res.status(200).json({
        data: user,
        message: 'get usersById successfully',
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const user = await usersService.deleteById(id);
      res.status(200).json({
        data: user,
        message: 'xoa thanh cong',
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // get user from req.user passed from authenticateJWT middleware
      if (!req.user) {
        res.status(401).json({
          message:
            'Khong tim thay thong tin nguoi dung. Vui long dang nhap lai',
        });
        return;
      }

      const id = req.user._id;
      const updateData: UpdateUserDto = req.body;

      // don't update role in that case
      delete (updateData as any).role;

      // Kiểm tra nếu cập nhật username
      if (updateData.usersname) {
        const existingUsername = await Users.findOne({
          usersname: updateData.usersname,
          _id: { $ne: id }, // Không tính người dùng hiện tại
        });

        if (existingUsername) {
          res.status(400).json({ message: 'Tên đăng nhập đã được sử dụng' });
          return;
        }
      }

      // Kiểm tra nếu cập nhật email
      if (updateData.email) {
        const existingEmail = await Users.findOne({
          email: updateData.email,
          _id: { $ne: id }, // Không tính người dùng hiện tại
        });

        if (existingEmail) {
          res.status(400).json({ message: 'Email đã được sử dụng' });
          return;
        }
      }

      // Kiểm tra nếu đã cung cấp đủ thông tin để đánh dấu hồ sơ là hoàn thành
      let profileCompleted = false;
      const user = await Users.findById(id);

      if (user) {
        // Kết hợp thông tin hiện tại với thông tin cập nhật
        const updatedUser = {
          ...user.toObject(),
          ...updateData,
        };

        // Kiểm tra nếu đã có đủ thông tin cần thiết
        if (updatedUser.phone && updatedUser.address) {
          profileCompleted = true;
        }
      }

      // Cập nhật thông tin người dùng
      const updatedUser = await Users.findByIdAndUpdate(
        id,
        {
          ...updateData,
          profileCompleted,
          $set: { profileCompleted },
        },
        { new: true },
      ).select('-password');

      if (!updatedUser) {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
        return;
      }

      res.status(200).json({
        message: 'Cập nhật thông tin thành công',
        data: updatedUser,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }
}
