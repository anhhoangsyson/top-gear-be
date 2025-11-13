import { Schema, model, Document, Types } from 'mongoose';

export interface IRating extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  laptopId?: Types.ObjectId | null; // Optional: nếu null thì rate cho toàn bộ order
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
    laptopId: {
      type: Schema.Types.ObjectId,
      ref: 'Laptop',
      default: null,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

// Compound index để đảm bảo mỗi user chỉ rate 1 lần cho 1 order/laptop
ratingSchema.index({ orderId: 1, userId: 1, laptopId: 1 }, { unique: true });

export default model<IRating>('Rating', ratingSchema);
