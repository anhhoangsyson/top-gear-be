import { Schema, model } from 'mongoose';
import { IVoucher } from '../dto/vocher.dto'; // Ensure you have created the file voucher.dto.ts with the IVoucher interface
const voucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, unique: true, sparse: true }, // Không required, chỉ unique nếu có
    type: { type: String, enum: ['code', 'auto'], required: true }, // Phân biệt loại voucher
    expiredDate: { type: Date, required: true },
    pricePercent: { type: Number, required: true, min: 0 },
    priceOrigin: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    // Có thể bổ sung thêm các điều kiện áp dụng khác nếu cần
  },
  { timestamps: true },
);
export const Voucher = model<IVoucher>('Voucher', voucherSchema);
