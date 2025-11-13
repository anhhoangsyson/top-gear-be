import { Schema, model } from 'mongoose';
import { IVoucher, IVoucherUsage } from '../dto/vocher.dto'; // Ensure you have created the file voucher.dto.ts with the IVoucher interface

const voucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, unique: true, sparse: true }, // Không required, chỉ unique nếu có
    type: { type: String, enum: ['code', 'auto'], required: true }, // Phân biệt loại voucher
    expiredDate: { type: Date, required: true },
    pricePercent: { type: Number, required: true, min: 0 },
    priceOrigin: { type: Number, required: true, min: 0 },
    minPrice: { type: Number, required: true, min: 0, default: 0 }, // Giá trị đơn hàng tối thiểu
    maxUsage: { type: Number, required: true, default: 1 }, // Số lần sử dụng tối đa
    currentUsage: { type: Number, required: true, default: 0 }, // Số lần đã sử dụng
    maxDiscountAmount: { type: Number, required: true, default: 0 }, // 0 = unlimited
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true },
);

// Create indexes for better query performance
voucherSchema.index({ code: 1, status: 1 });
voucherSchema.index({ expiredDate: 1, status: 1 });
voucherSchema.index({ type: 1, status: 1 });

// VoucherUsage schema for tracking usage history
const voucherUsageSchema = new Schema<IVoucherUsage>(
  {
    voucherId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, unique: true }, // Mỗi order chỉ dùng 1 voucher
    discountAmount: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'refunded'],
      default: 'active',
    },
  },
  { timestamps: true },
);

// Compound index for efficient queries
voucherUsageSchema.index({ voucherId: 1, userId: 1 });
voucherUsageSchema.index({ orderId: 1 });

export const Voucher = model<IVoucher>('Voucher', voucherSchema);
export const VoucherUsage = model<IVoucherUsage>(
  'VoucherUsage',
  voucherUsageSchema,
);
