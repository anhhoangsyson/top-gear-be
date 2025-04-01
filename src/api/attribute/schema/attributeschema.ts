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
    // attributeValue: { type: String, required: true },
  },
  { timestamps: true },
);
export const Attribute = model('Attribute', AttributeSchema);
