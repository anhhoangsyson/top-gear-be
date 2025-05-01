import { ref } from 'joi';
import mongoose, { Schema, model } from 'mongoose';

export interface IProduct {
  productName: string;
  categoriesId: string;
  createdAt?: Date;
  updateAt?: Date;
}

const AttributeSchema = new Schema(
  {
    attributeName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    // attributeValue: { type: String, required: true },
  },
  { timestamps: true },
);
export const Attribute = model('Attribute', AttributeSchema);

// create attributeCategory schema
export interface CategoryAttribute {
  attributeId: string;
  categoryId: string;
}

const CategoryAttributeSchema = new Schema(
  {
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: 'Attribute',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true },
);

export const CategoryAttribute = model(
  'CategoryAttribute',
  CategoryAttributeSchema,
);
