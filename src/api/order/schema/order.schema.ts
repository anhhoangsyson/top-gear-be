import { Schema, model, Document } from 'mongoose';
import { IUser } from '../../users/dto/users.dto';

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_CANCELING = 'payment_cancelling',
  PAYMENT_FAIL = 'payment_fail',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IOrder extends Document {
  voucherId?: string | null;
  customerId: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  address: string;
  discountAmount: number;
  paymentMethod: String;
  paymentUrl: string;
  paymentTransactionId: string;
  orderDetails: Array<any>;
  createAt: Date;
  note?: string; // Assuming OrderDetail is another model, you can replace 'any' with the actual type
}

export interface IOrderWithCustomer extends IOrder {
  customer:
    | Omit<
        IUser,
        | 'password'
        | 'role'
        | 'avatar'
        | '_id'
        | 'createAt'
        | 'updateAt'
        | 'usersname'
        | 'sex'
      >
    | 'email';
}

const orderSchema = new Schema<IOrder>({
  voucherId: { type: String, default: null },
  customerId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  address: { type: String, required: true },
  discountAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, required: true },
  paymentUrl: { type: String, default: null },
  paymentTransactionId: { type: String, default: null },
  orderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }],
  createAt: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});
export default model<IOrder>('Order', orderSchema);
