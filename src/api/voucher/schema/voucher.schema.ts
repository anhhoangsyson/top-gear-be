import { Schema, model, Document } from 'mongoose';

export interface IVoucher extends Document {
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

const VoucherSchema = new Schema<IVoucher>({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['fixed', 'percentage'], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: Infinity },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: Infinity },
  usedCount: { type: Number, default: 0 },
});

export default model<IVoucher>('Voucher', VoucherSchema);
