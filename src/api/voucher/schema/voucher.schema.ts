import { Schema, model } from 'mongoose';
import { IVoucher } from '../dto/vocher.dto'; // Ensure you have created the file voucher.dto.ts with the IVoucher interface
const voucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, required: true, unique: true }, // Unique code for the voucher
    expiredDate: { type: Date, required: true }, // Expiration date of the voucher
    pricePercent: { type: Number, required: true, min: 0 }, // Discount percentage (should not be negative)
    priceOrigin: { type: Number, required: true, min: 0 }, // Original price before discount (should not be negative)
    status: {
      type: String,
      enum: ['active', 'inactive'], // Possible statuses
      default: 'active', // Default status
    },
  },
  { timestamps: true }, // Automatically manage createdAt and updatedAt fields
);
export const Voucher = model<IVoucher>('Voucher', voucherSchema);
