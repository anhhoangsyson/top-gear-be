// import mongoose from 'mongoose';

// export interface IUser {
//   _id: mongoose.Types.ObjectId;
//   role: string;
//   fullname: string;
//   email: string;
//   usersname: string;
//   password: string;
//   phone: number;
//   address: string;
//   sex: string;
//   socialAuth:[
//     {
//       provider: string;
//       providerId: string;
//       accessToken: string;
//       refreshToken: string;
//       profile: object;
//       lastLogin: Date;
//     }
//   ],
//   pofileCompleted: boolean;
//   authType: string;
//   avatar: string;
//   createAt: Date;
//   updateAt: Date;
// }
// export interface createUser {
//   role: string;
//   fullname: string;
//   email: string;
//   usersname: string;
//   password: string;
//   phone: number;
//   address: string;
//   sex: string;
//   avatar: string;
// }

import mongoose from 'mongoose';

export interface ISocialAuth {
  provider: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  profile?: any;
  lastLogin: Date;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  role: string;
  fullname: string;
  email: string;
  usersname: string;
  password: string;
  phone?: number; // Optional
  address?: string; // Optional
  sex: string;
  avatar?: string; // Optional
  socialAuth?: ISocialAuth[];
  authType: 'local' | 'facebook' | 'google';
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface mới cho đăng ký tối thiểu
export interface RegisterUserDto {
  fullname: string;
  email: string;
  usersname: string;
  password: string;
}

// Interface đầy đủ cho tạo người dùng (admin sử dụng)
export interface CreateUserDto {
  role: string;
  fullname: string;
  email: string;
  usersname: string;
  password: string;
  phone?: number;
  address?: string;
  sex?: string;
  avatar?: string;
}

// Interface cho cập nhật thông tin người dùng
export interface UpdateUserDto {
  fullname?: string;
  email?: string;
  usersname?: string;
  phone?: number;
  address?: string;
  sex?: string;
  avatar?: string;
}

// Interface cho đổi mật khẩu
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  email: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}
