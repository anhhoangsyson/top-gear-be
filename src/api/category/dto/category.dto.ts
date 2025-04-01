import { ObjectId } from 'mongodb';

export interface CategoryDto {
  _id: string | ObjectId;
  categoryName: string;
  isDeleted?: boolean;
}

export interface CreateCategoryDto {
  categoryName: string;
}

export interface UpdateCategoryDto {
  categoryName?: string;
  isDeleted?: boolean;
}

export interface CategoryAttributeDto {
  _id: string | ObjectId;
  categoryId: string | ObjectId;
  attributeId: string | ObjectId;
  attributeName: string;
}

export interface AddCategoryAttributeDto {
  attributeId: string;
}
