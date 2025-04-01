import type { ObjectId } from 'mongodb';

export interface ICategories {
  _id: ObjectId;
  categoryName: string;
  parentCategoryId?: string | ObjectId;
  isFilter?: boolean;
  isDeleted?: boolean;
}

export interface ICreateCategories {
  categoryName: string;
  parentCategoryId?: string | ObjectId | null;
  isFilter?: boolean | false;
  isDeleted?: boolean | false;
}

export interface IUpdateCategories {
  categoriesName?: string;
  isDeleted?: boolean;
}

// Here for the CategoriesAttribute
export interface ICategoriesAttribute {
  categoriesId: string | ObjectId;
  attributeId: string | ObjectId;
  attributeName: string;
}

export interface IAddCategoriesAttribute {
  categoriesId: string;
  attributeId: string;
  attributeName: string;
}
