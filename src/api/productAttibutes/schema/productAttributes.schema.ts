import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import { StatusProductVariant } from '../../../constants/status/status.constant';

export interface IProductAttribute extends Document {
  variantId: mongoose.Types.ObjectId;
  attributeId: mongoose.Types.ObjectId;
  attributeValue: string;
  status?: string;
}

const ProductAttributesSchema = new Schema(
  {
    variantId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: 'attributes',
      required: true,
    },
    attributeValue: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusProductVariant),
      default: 'active',
    },
  },
  { timestamps: true },
);

// export const ProductAttribute = model<IProductAttribute>('productAttributes', ProductAttributesSchema);
export const ProductAttribute = model<IProductAttribute>(
  'ProductAttribute',
  ProductAttributesSchema,
);
