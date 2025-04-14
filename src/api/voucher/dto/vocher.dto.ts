import mongoose from 'mongoose';

export interface IVoucher {
  _id: mongoose.Types.ObjectId;
  code: string;
  expiredDate: Date;
  pricePercent: number;
  priceOrigin: number;
  status: string; // Có thể là 'active', 'inactive', hoặc trạng thái khác tùy theo yêu cầu
  createdAt: Date; // Thời gian tạo
  updatedAt: Date; // Thời gian cập nhật
}

export interface createVoucher {
  code: string;
  expiredDate: Date;
  pricePercent: number;
  priceOrigin: number;
  status: string; // Có thể là 'active', 'inactive', hoặc trạng thái khác
}
