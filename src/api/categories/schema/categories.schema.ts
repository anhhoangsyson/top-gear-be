import { Schema, model } from 'mongoose';
import { ICategoriesAttribute, ICategories } from '../dto/categories.dto';

// const CategoriesShema = new Schema<ICategories>(
const CategoriesShema = new Schema(
  {
    categoryName: { type: String, required: true },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      default: null,
    },
    isFilter: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const CategoriesAttributeSchema = new Schema<ICategoriesAttribute>(
  {
    categoriesId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: 'attributes',
      required: true,
    },

    attributeName: { type: String, required: true },
  },
  { timestamps: true },
);

export const Categories = model<ICategories>('categories', CategoriesShema);
export const CategoriesAtribute = model<ICategoriesAttribute>(
  'categoriesAttribute',
  CategoriesAttributeSchema,
);
