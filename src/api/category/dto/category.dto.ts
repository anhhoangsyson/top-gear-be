import mongoose from 'mongoose';

export interface ICreateCategoryDto {
  name: string;
  description?: string;
  slug?: string;
  parentId?: mongoose.Types.ObjectId | null;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface IUpdateCategoryDto {
  name: string;
  description?: string;
  slug?: string;
  parentId?: mongoose.Types.ObjectId | null;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}
