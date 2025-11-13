import mongoose, { model, Schema } from 'mongoose';
import { StatusProductVariant } from '../../../constants/status/status.constant';

export interface IProductVariants {
  productId: mongoose.Types.ObjectId;
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  filterCategories: string[];
  variantStock: number;
  status?: string;
}
export interface IProductVariantDetail extends IProductVariants {
  attribute: any[];
  productimages: any[];
}
const productVariantsSchema = new Schema(
  {
    productId: {
      type: String,
      ref: 'products',
      required: true,
    },
    variantName: {
      type: String,
      required: true,
    },
    variantPriceSale: {
      type: Number,
      required: true,
    },
    filterCategories: [
      {
        type: String,
        ref: 'categories',
        required: true,
      },
    ],
    variantPrice: {
      type: Number,
      required: true,
    },
    variantStock: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusProductVariant),
      default: StatusProductVariant.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

// Create text index for search functionality
productVariantsSchema.index({ variantName: 'text' });

export const ProductVariants = model('ProductVariant', productVariantsSchema);
