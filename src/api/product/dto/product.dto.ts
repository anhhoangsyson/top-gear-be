import mongoose from 'mongoose';

export interface ProductDto extends Document {
  id: string;
  productName: string;
  categoriesId: mongoose.Types.ObjectId;
  createAt: Date;
  updateAt: Date;
}

export interface CreateProductDto {
  productName: string;
  categoriesId: mongoose.Types.ObjectId;
}

export interface UpdateProductDto {
  productName: string;
  // categoriesId: mongoose.Types.ObjectId;
}
