import mongoose from 'mongoose';

export interface CreateProductVariantsDto {
  productId: mongoose.Types.ObjectId;
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  filterCategories: string[];
  variantStock: number;
}

export interface UpdateProductVariantsDto {
  variantName: string;
  variantPrice?: number;
  variantStock?: number;
  status?: string;
}
