import { Schema, model, Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  laptopId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
    laptopId: {
      type: Schema.Types.ObjectId,
      ref: 'Laptop',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Unique constraint: một user chỉ có thể thêm một laptop vào wishlist một lần
wishlistSchema.index({ userId: 1, laptopId: 1 }, { unique: true });

export default model<IWishlist>('Wishlist', wishlistSchema);
