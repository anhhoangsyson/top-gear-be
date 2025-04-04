import { Schema, model } from 'mongoose';

const ZaloPaymentSchema = new Schema({
  app_trans_id: { type: String, unique: true }, // Chỉ cần cho ZaloPay
  amount: { type: Number, required: true },
  nameUser: { type: String, required: true },
  description: { type: String },
  paymentMethod: { type: String, enum: ['cash', 'zalopay'], required: true },
  status: {
    type: String,
    enum: ['waiting', 'success', 'failed'],
    default: 'waiting',
  },
  dataSave: { type: String }, // Chỉ cần cho ZaloPay
  createdAt: { type: Date, default: Date.now },
  mac: { type: String, require: true }, // Chỉ cần cho ZaloPay
});

export const ZaloPayment = model('ZaloPayment', ZaloPaymentSchema);
