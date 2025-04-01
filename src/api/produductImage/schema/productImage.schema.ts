import mongoose, { Schema, model } from 'mongoose';
import z from 'zod';

// for validation
export const productImageZodSchema = z.object({
  productVariantId: z.string(),
  imageUrl: z.string().url(),
});

// for mongoose schema
const ProductImageSchema = new Schema(
  {
    productVariantId: {
      type: mongoose.Types.ObjectId,
      ref: 'productvariants',
      required: true,
    },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const ProductImage = model('ProductImage', ProductImageSchema);
