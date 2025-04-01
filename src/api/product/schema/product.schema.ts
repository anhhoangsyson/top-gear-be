import mongoose, { model, Schema } from 'mongoose';

const ProductSchema = new Schema({
  productName: { type: String, required: true },
  categoriesId: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
});

ProductSchema.virtual('productImages', {
  ref: 'productimages', // Tên của model ProductImages
  localField: '_id', // Trường của productVariant liên kết với productImages
  foreignField: 'productVariantId', // Trường trong productImages trỏ đến productVariants
});

ProductSchema.virtual('productAttributes', {
  ref: 'productattributes', // Tên của model ProductAttributes
  localField: '_id', // Trường của ProductVariants
  foreignField: 'productVariantId', // Trường của ProductAttributes trỏ về ProductVariants
});

export const Product = model('Product', ProductSchema);
