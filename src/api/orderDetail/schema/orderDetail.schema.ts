import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IOrderDetail {
  laptopId: Types.ObjectId;
  quantity: number;
  price: number;
  subTotal: number;
}
export interface IOrderDetailResponse extends IOrderDetail, Document {}

const OrderDetailSchema = new Schema<IOrderDetail>({
  laptopId: { type: Schema.Types.ObjectId, ref: 'Laptop', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subTotal: { type: Number, required: true },
});

export default model<IOrderDetail>('OrderDetail', OrderDetailSchema);
