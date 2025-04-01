import mongoose from 'mongoose';

export interface CreateProductAttributes {
  variantId: mongoose.Types.ObjectId;
  attributeId: mongoose.Types.ObjectId;
  attributeValue: string;
  status?: string;
}
export interface UpdateProductAttributes {
  attributeValue: string;
  status?: string;
}
