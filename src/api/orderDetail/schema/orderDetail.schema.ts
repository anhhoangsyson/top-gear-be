import mongoose, { Schema, model, Document } from 'mongoose';

export interface IOrderDetail {
  _id?: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
  price: number;
  subTotal: number;
}

const OrderDetailSchema = new Schema<IOrderDetail>({
  orderId: {
    type: String,
    required: true,
    ref: 'Order',
  },
  productVariantId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subTotal: { type: Number, required: true },
});

export default model<IOrderDetail>('OrderDetail', OrderDetailSchema);
